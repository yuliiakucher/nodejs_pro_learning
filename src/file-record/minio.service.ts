import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private client: Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      endPoint: configService.getOrThrow('MINIO_HOST'),
      port: configService.getOrThrow('MINIO_PORT'),
      useSSL: false,
      // 👇 only include if they exist
      ...(this.configService.get('MINIO_ACCESS_KEY') && {
        accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      }),
      ...(this.configService.get('MINIO_SECRET_KEY') && {
        secretKey: this.configService.get('MINIO_SECRET_KEY'),
      }),
    });
  }

  getBucket(): string {
    return this.configService.getOrThrow('BUCKET');
  }

  async generatePresignedUrl(key: string) {
    const bucket = this.getBucket();
    const url = await this.client.presignedPutObject(
      bucket,
      key,
      60 * 5, // 5 minutes
    );
    return url;
  }

  async getPresignedUrl(key: string) {
    const bucket = this.getBucket();

    const presignedUrl = await this.client.presignedGetObject(
      bucket,
      key,
      60 * 5,
    ); // 5 minutes
    return presignedUrl;
  }
}
