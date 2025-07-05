import { IsString, IsNotEmpty } from 'class-validator';

export class AiTeamAssistantDto {
    @IsString()
    @IsNotEmpty()
    readonly teamId: string;
}
