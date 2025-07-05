import { IsString, IsNotEmpty } from 'class-validator';

export class AssignMedicalDto {
  @IsString()
  @IsNotEmpty()
  readonly partnerId: string;
}
