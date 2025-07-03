export class CreateUserDto {
    readonly name: string;
    readonly email: string;
    // password hashing would be handled in the service
}
