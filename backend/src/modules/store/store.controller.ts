import { Controller, Get } from "@nestjs/common";
import { StoreService } from "./store.service";
import { ApiOperation, ApiTags, ApiResponse } from "@nestjs/swagger";
import { Public } from "../auth/decorators/public.decorator";
import { StoreItemDto } from "./dto/store-item.dto";

@ApiTags("Store")
@Controller("store")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Public()
  @Get("items")
  @ApiOperation({ summary: "Получить список всех товаров в магазине" })
  @ApiResponse({
    status: 200,
    description: "Список товаров.",
    type: [StoreItemDto],
  })
  findAll() {
    return this.storeService.findAll();
  }
}
