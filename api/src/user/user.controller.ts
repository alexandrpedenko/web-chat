import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { Serialize } from 'src/core/decorators/serialize.decorator';
import { UsersResponseDto, UserResponseDto } from './dto/response';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Serialize(UsersResponseDto)
  @Get()
  getAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.userService.getAllUsers(page, limit);
  }

  @Serialize(UserResponseDto)
  @Get(':id')
  getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }
}
