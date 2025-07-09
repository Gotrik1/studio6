import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { CreateInventoryItemDto } from "./dto/create-inventory-item.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthenticatedRequest } from "@/shared/types/authenticated-request";

@ApiTags("Inventory")
@Controller("inventory")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: "Получить инвентарь текущего пользователя" })
  findForUser(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.inventoryService.findAllForUser(userId);
  }

  @Post()
  @ApiOperation({ summary: "Добавить предмет в инвентарь" })
  create(@Body() createDto: CreateInventoryItemDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.inventoryService.create(userId, createDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Удалить предмет из инвентаря" })
  remove(@Param("id") id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.inventoryService.remove(id, userId);
  }
}
