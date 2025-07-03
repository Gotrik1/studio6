
export class CreateUserDto {
    readonly name: string;
    readonly email: string;
    readonly role: string;
    readonly password!: string;
}
