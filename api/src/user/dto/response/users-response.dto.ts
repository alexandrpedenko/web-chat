import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserResponseDto } from './user-response.dto';
import { MetaPagination } from 'src/core/dto';

export class UsersResponseDto {
  @Type(() => UserResponseDto)
  @Expose()
  items: UserResponseDto[];

  @Type(() => MetaPagination)
  @ValidateNested()
  @Expose()
  meta: MetaPagination;
}
