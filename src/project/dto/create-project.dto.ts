import { IsNotEmpty, IsOptional, IsString, IsDateString, IsInt } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  project_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  start_date: Date;

  @IsOptional()
  @IsDateString()
  end_date?: Date;

  // Default status = 1 (In Progress)
  @IsOptional()
  @IsInt()
  idstatus?: number;

  // User yang ditugaskan sebagai project manager
  @IsOptional()
  @IsInt()
  assigned_to?: number;

  // Diisi otomatis dari JWT user login
  @IsOptional()
  @IsInt()
  created_by?: number;
}
