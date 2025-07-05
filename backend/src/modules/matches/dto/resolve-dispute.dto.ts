import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class ResolveDisputeDto {
    @IsString()
    @IsNotEmpty()
    readonly winnerId: string;
    
    @IsString()
    @IsNotEmpty()
    readonly resolution: string;

    @IsInt()
    @IsNotEmpty()
    readonly score1: number;

    @IsInt()
    @IsNotEmpty()
    readonly score2: number;
}
