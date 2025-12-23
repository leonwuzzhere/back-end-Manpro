import { IsNotEmpty, IsOptional, IsString, IsDateString, IsInt } from 'class-validator';

export class CreateDivisiDto {
  @IsNotEmpty()
  @IsString()
  nama_divisi: string;

  @IsOptional()
  @IsString()
  main_task?: string;

  @IsNotEmpty()
  @IsDateString()
  start_date: Date;

  @IsOptional()
  @IsDateString()
  end_date?: Date;

  @IsOptional()
  @IsInt()
  idstatus?: number;

  @IsOptional()
  @IsInt()
  koordinator?: number;

  @IsNotEmpty()
  @IsInt()
  idproject: number;
}
