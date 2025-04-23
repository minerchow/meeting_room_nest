import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // 存储目录
      filename: (req, file, cb) => {
        console.log("req",req);
        console.log("file2",file)
        cb(null, file.originalname);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('Received file:', file);
    if (!file) {
      console.error('No file received');
      return { error: 'No file received' };
    }
    return this.uploadService.uploadToQiniu(file);
  }
}