import { IsString, IsOptional, IsDateString, IsInt } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  project_name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsInt()
  idstatus?: number;
}
