import { IsString, IsNotEmpty, IsArray, ValidateNested, IsInt, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class ExerciseDetailDto {
  @IsString()
  name: string;

  @IsString()
  sets: string;

  @IsString()
  reps: string;

  @IsString()
  @IsOptional()
  plannedWeight?: string;
  
  @IsBoolean()
  @IsOptional()
  isSupersetWithPrevious?: boolean;
  
  @IsString()
  @IsOptional()
  technique?: string;
}

class WorkoutDayDto {
  @IsInt()
  day: number;

  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDetailDto)
  exercises: ExerciseDetailDto[];
}

export class CreateProgramData {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['Набор массы', 'Снижение веса', 'Рельеф', 'Сила'])
  goal: 'Набор массы' | 'Снижение веса' | 'Рельеф' | 'Сила';

  @IsEnum(['Full-body', 'Split', 'Upper/Lower'])
  splitType: 'Full-body' | 'Split' | 'Upper/Lower';
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutDayDto)
  weeklySplit: WorkoutDayDto[];
}

export class UpdateProgramData extends CreateProgramData {}
