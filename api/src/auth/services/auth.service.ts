import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from 'src/entities/user.entity';
import { AuthResponseDto } from 'src/auth/dto/response';
import { LogInUserDto, CreateUserDto } from 'src/auth/dto/request';
import { RESPONSE_MESSAGES } from 'src/core/constants/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,

    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  public async registerUser(user: CreateUserDto): Promise<{ message: string }> {
    const isUserExists = await this.isUserExists(user.email);

    if (isUserExists) {
      throw new HttpException(
        RESPONSE_MESSAGES.userAlreadyRegistered,
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await this.hashPassword(user.password);
    const created = this.usersRepository.create({
      email: user.email,
      username: user.username,
      password: hashedPassword,
    });

    await this.usersRepository.save(created);

    return { message: RESPONSE_MESSAGES.userRegistered };
  }

  public async login(userPayload: LogInUserDto): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findOneBy({
      email: userPayload.email,
    });

    if (user === null) {
      throw new HttpException(
        RESPONSE_MESSAGES.invalidUserCredentials,
        HttpStatus.BAD_REQUEST,
      );
    }
    const { id, email, username, password } = user;
    const isPasswordValid = await this.comparePasswords(
      userPayload.password,
      password,
    );

    if (isPasswordValid) {
      const [accessToken, refreshToken] = await this.generateJwt({
        id,
        email,
      });
      user.refreshToken = refreshToken;
      await this.usersRepository.save(user);

      return {
        user: { id, email, username, refreshToken },
        accessToken,
      };
    }

    throw new HttpException(
      RESPONSE_MESSAGES.invalidUserCredentials,
      HttpStatus.BAD_REQUEST,
    );
  }

  public async logout(id: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOneBy({
      id,
    });

    if (user === null) {
      throw new HttpException(
        RESPONSE_MESSAGES.invalidUserCredentials,
        HttpStatus.UNAUTHORIZED,
      );
    }

    user.refreshToken = null;
    await this.usersRepository.save(user);
    return { message: 'User successfully logged out' };
  }

  public async regenerateRefreshToken(
    id: string,
    oldRefreshToken: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user === null) {
      throw new HttpException(
        RESPONSE_MESSAGES.invalidUserCredentials,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { email, refreshToken } = user;
    if (refreshToken !== oldRefreshToken) {
      throw new HttpException(
        RESPONSE_MESSAGES.invalidUserCredentials,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const [accessToken, newRefreshToken] = await this.generateJwt({
      email,
      id,
    });
    user.refreshToken = newRefreshToken;
    await this.usersRepository.save(user);

    return { accessToken, refreshToken: newRefreshToken };
  }

  public async isUserExists(email: string): Promise<boolean> {
    const existedUser = await this.usersRepository.findOneBy({ email });

    if (existedUser === null) {
      return false;
    }
    return true;
  }

  private async generateJwt({
    id,
    email,
  }: {
    id: string;
    email: string;
  }): Promise<string[]> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          user: {
            id,
            email,
          },
        },
        { secret: this.configService.get('JWT_SECRET'), expiresIn: '10m' },
      ),

      this.jwtService.signAsync(
        {
          user: {
            id,
            email,
          },
        },
        {
          secret: this.configService.get('JWT_REFRESH'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return [accessToken, refreshToken];
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async comparePasswords(
    inputPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }
}
