import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: 'Superuser', description: 'The name of the user.' })
    readonly name: string;
    
    @ApiProperty({ example: 'user@example.com', description: 'The email of the user.' })
    readonly email: string;
    
    @ApiProperty({ example: 'Игрок', description: 'The role of the user.' })
    readonly role: string;
    
    @ApiProperty({ example: 'password123', description: 'The password for the user (only for initial creation).', required: false })
    readonly password?: string;
}
