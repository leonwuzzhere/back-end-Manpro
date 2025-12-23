import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, IsDate } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional() @IsInt()
  idproject?: number;

  @IsOptional() @IsInt()
  iddivisi?: number;

  @IsOptional() @IsString() @MaxLength(200)
  nama_task?: string;

  @IsOptional() @IsInt()
  assign_to?: number;

  @IsOptional() @Type(() => Date) @IsDate()
  start_date?: Date;

  @IsOptional() @Type(() => Date) @IsDate()
  end_date?: Date;

  @IsOptional() @IsInt()
  idstatus_task?: number;
}
