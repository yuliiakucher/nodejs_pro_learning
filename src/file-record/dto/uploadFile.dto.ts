import { IsInt, IsString } from 'class-validator';

export class UploadFileDto {
  @IsString()
  contentType: string;
  @IsInt()
  size: number;
}
