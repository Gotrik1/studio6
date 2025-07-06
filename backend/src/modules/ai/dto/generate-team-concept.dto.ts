import { ApiProperty } from "@nestjs/swagger";

export class GenerateTeamConceptDto {
  @ApiProperty({
    description:
      "A text prompt describing the team idea, its style, origin, or mascot.",
    example: "An aggressive CS:GO 2 team from Moscow, our symbol is a wolf",
  })
  readonly prompt: string;
}
