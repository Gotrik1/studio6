import { ApiProperty } from "@nestjs/swagger";

class FaqQuestionDto {
  @ApiProperty()
  q: string;

  @ApiProperty()
  a: string;
}

export class FaqCategoryDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  value: string;

  @ApiProperty({ type: [FaqQuestionDto] })
  questions: FaqQuestionDto[];
}
