import { IsString, MinLength } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  @MinLength(3, { message: 'Тема должна быть не менее 3 символов.' })
  readonly subject: string;

  @IsString()
  @MinLength(10, { message: 'Сообщение должно быть не менее 10 символов.' })
  readonly message: string;
}
