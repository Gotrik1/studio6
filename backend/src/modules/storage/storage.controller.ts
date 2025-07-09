import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { GetPresignedUrlDto } from "./dto/get-presigned-url.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Storage")
@Controller("storage")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post("presigned-url")
  async getPresignedUrl(@Body() getPresignedUrlDto: GetPresignedUrlDto) {
    const { fileName, fileType } = getPresignedUrlDto;
    return this.storageService.getPresignedUrlForUpload(fileName, fileType);
  }
}
