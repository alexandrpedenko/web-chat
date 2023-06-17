import { Expose, Transform, Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  @IsOptional()
  refreshToken?: string;
}

export class AuthResponseDto {
  @IsString()
  @Expose()
  accessToken: string;

  @Type(() => UserResponseDto)
  @ValidateNested()
  @Expose()
  user: UserResponseDto;
}
