import { IsString, IsNotEmpty } from 'class-validator';

export class SetCaptainDto {
  @IsString()
  @IsNotEmpty()
  readonly newCaptainId: string;
}
