import { Module } from '@nestjs/common';
import { FileRecordEntity } from './entities/fileRecord.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRecordController } from './file-record.controller';
import { FileRecordService } from './file-record.service';
import { ConfigModule } from '@nestjs/config';
import { MinioService } from './minio.service';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileRecordEntity, UserEntity]),
    ConfigModule,
  ],
  controllers: [FileRecordController],
  providers: [FileRecordService, MinioService],
})
export class FileRecordModule {}
