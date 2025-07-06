import { IsString, IsNotEmpty } from "class-validator";

export class SetHomePlaygroundDto {
  @IsString()
  @IsNotEmpty()
  readonly playgroundId: string;
}
