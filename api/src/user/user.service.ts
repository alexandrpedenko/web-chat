import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';

import { RESPONSE_MESSAGES } from 'src/core/constants';
import { UserEntity } from 'src/entities/user.entity';
import { UserResponseDto } from './dto/response/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers(page: number, limit: number) {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    return await paginate<UserEntity>(queryBuilder, {
      page,
      limit,
    });
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({
      id,
    });

    if (!user) {
      throw new HttpException(
        RESPONSE_MESSAGES.userNotFound,
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }
}
