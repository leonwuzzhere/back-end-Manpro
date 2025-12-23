import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, IsDate } from 'class-validator';

export class CreateTaskDto {
  @IsInt()
  idproject: number;

  @IsInt()
  iddivisi: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nama_task: string;

  @IsInt()
  assign_to: number;

  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @Type(() => Date)
  @IsDate()
  end_date: Date;

  @IsOptional()
  @IsInt()
  idstatus_task?: number;
}
