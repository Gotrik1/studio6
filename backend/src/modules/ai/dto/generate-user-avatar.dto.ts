import { ApiProperty } from '@nestjs/swagger';

export class GenerateUserAvatarDto {
  @ApiProperty({
    description: 'A text description of the desired avatar image.',
    example: 'a heroic knight with a glowing sword',
  })
  readonly prompt: string;
}
