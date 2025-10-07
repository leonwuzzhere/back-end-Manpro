import { IsOptional, IsString, IsEmail, Length, IsInt } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  email?: string;

  @IsOptional()
  @IsInt()
  idrole?: number;
}
