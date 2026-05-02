import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { FileRecordService } from './file-record.service';
import { UploadFileDto } from './dto/uploadFile.dto';
import { UserAuthDto } from '../auth/dto/auth.dto';
import { CompleteUploadDto } from './dto/completeUpload.dto';

@Controller('files')
export class FileRecordController {
  constructor(
    @Inject() private readonly fileRecordService: FileRecordService,
  ) {}

  @Post('presign')
  @UseGuards(JwtAuthGuard)
  presign(
    @CurrentUser() user: UserAuthDto,
    @Body() uploadFileDto: UploadFileDto,
  ) {
    return this.fileRecordService.presign(user.sub, uploadFileDto);
  }

  @Post('complete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  complete(
    @CurrentUser() user: UserAuthDto,
    @Body() completeUploadDto: CompleteUploadDto,
  ) {
    return this.fileRecordService.complete(user, completeUploadDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getFile(@Param('id') id: string, @CurrentUser() user: UserAuthDto) {
    return this.fileRecordService.getFile(user, id);
  }
}
