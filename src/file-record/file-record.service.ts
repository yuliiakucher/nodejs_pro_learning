import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FileRecordEntity,
  Status,
  Visibility,
} from './entities/fileRecord.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { MinioService } from './minio.service';
import { UploadFileDto } from './dto/uploadFile.dto';
import { CompleteUploadDto } from './dto/completeUpload.dto';
import { UserAuthDto } from '../auth/dto/auth.dto';

@Injectable()
export class FileRecordService {
  constructor(
    @InjectRepository(FileRecordEntity)
    private readonly fileRepository: Repository<FileRecordEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject() private readonly minioService: MinioService,
  ) {}

  async presign(userId: string, uploadFileDto: UploadFileDto) {
    const { size, contentType } = uploadFileDto;
    const uuid = crypto.randomUUID();
    const key = `users/${userId}/avatars/${uuid}.jpg`;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const fileRecord = this.fileRepository.create({
      user,
      key,
      status: Status.PENDING,
      contentType,
      visibility: Visibility.PRIVATE,
      size,
    });

    await this.fileRepository.save(fileRecord);

    const url = await this.minioService.generatePresignedUrl(key);

    return {
      fileId: fileRecord.id,
      key,
      uploadUrl: url,
      contentType,
    };
  }

  async complete(authUser: UserAuthDto, completeUploadDto: CompleteUploadDto) {
    await this.checkIfAccessAllowed(authUser, completeUploadDto.fileId);

    const file = await this.fileRepository.findOne({
      where: { id: completeUploadDto.fileId },
    });
    if (!file) {
      throw new NotFoundException('file not found');
    }

    await this.fileRepository.update(
      { id: completeUploadDto.fileId },
      {
        status: Status.READY,
      },
    );

    await this.userRepository.update({ id: authUser.sub }, { avatar: file.id });
  }

  async checkIfAccessAllowed(user: UserAuthDto, fileId: string): Promise<void> {
    const isPrivilegedAccess = user.roles.some((role) =>
      ['admin', 'support'].includes(role),
    );

    const file = await this.fileRepository.findOne({
      where: {
        id: fileId,
      },
      relations: {
        user: true,
      },
    });

    const isFileOwner = file?.user.id === user.sub;

    if (!(isPrivilegedAccess || isFileOwner)) {
      throw new ForbiddenException('Access denied');
    }
  }

  async getFile(authUser: UserAuthDto, id: string): Promise<{ url: string }> {
    await this.checkIfAccessAllowed(authUser, id);
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException('file not found');
    }

    const presignedUrl = await this.minioService.getPresignedUrl(file.key);

    return { url: presignedUrl };
  }
}
