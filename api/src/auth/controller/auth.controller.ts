import {
  Controller,
  Body,
  Post,
  HttpStatus,
  HttpCode,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthResponseDto } from 'src/auth/dto/response';
import { AuthService } from 'src/auth/services/auth.service';
import { CreateUserDto, LogInUserDto } from 'src/auth/dto/request';
import { Serialize } from 'src/core/decorators/serialize.decorator';
import { JwtAuthGuard, JwtRefreshAuthGuard } from 'src/auth/guards';
import { GetCurrentUserDta } from 'src/core/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    return await this.authService.registerUser(createUserDto);
  }

  @Serialize(AuthResponseDto)
  @Post('login')
  async logInUser(
    @Body() logInUserDto: LogInUserDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.login(logInUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logoutUser(
    @GetCurrentUserDta('id') id: string,
  ): Promise<{ message: string }> {
    return await this.authService.logout(id);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetCurrentUserDta('refreshToken') refreshToken: string,
    @GetCurrentUserDta('id') id: string,
  ) {
    return await this.authService.regenerateRefreshToken(id, refreshToken);
  }
}
