import { IsString, IsNotEmpty, IsInt, Min, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum MealType {
  Breakfast = "Завтрак",
  Lunch = "Обед",
  Dinner = "Ужин",
  Snack = "Перекус",
}

export class CreateFoodLogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly foodItemId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  readonly grams: number;

  @ApiProperty({
    enum: MealType,
    example: MealType.Snack,
    description: "Прием пищи, к которому относится запись.",
  })
  @IsEnum(MealType)
  readonly meal: MealType;
}
