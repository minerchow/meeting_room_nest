import { Injectable } from '@nestjs/common';
import * as qiniu from 'qiniu';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly bucket: string;
  private readonly mac: qiniu.auth.digest.Mac;
  private readonly config: qiniu.conf.Config;
  private readonly formUploader: qiniu.form_up.FormUploader;
  private readonly putExtra: qiniu.form_up.PutExtra;
  private readonly domain: string;

  constructor(private readonly configService: ConfigService) {
    this.accessKey = this.configService.get<string>('QINIU_ACCESS_KEY');
    this.secretKey = this.configService.get<string>('QINIU_SECRET_KEY');
    this.bucket = this.configService.get<string>('QINIU_BUCKET');
    this.domain = this.configService.get<string>('QINIU_DOMAIN');

    this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    this.config = new qiniu.conf.Config();
    this.formUploader = new qiniu.form_up.FormUploader(this.config);
    this.putExtra = new qiniu.form_up.PutExtra();
  }

  async uploadToQiniu(file: Express.Multer.File) {
    if (!file.destination || !file.filename) {
      throw new Error('File destination or filename is undefined');
    }

    const options = {
      scope: this.bucket,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(this.mac);

    const filePath = path.join(file.destination, file.filename);
    const readStream = fs.createReadStream(filePath);

    // 修改存储的文件名，添加 uploads/ 前缀
    const key = `uploads/${file.originalname}`;

    return new Promise((resolve, reject) => {
      this.formUploader.putStream(
        uploadToken,
        key,
        readStream,
        this.putExtra,
        function (respErr, respBody, respInfo) {
          if (respErr) {
            reject(respErr);
          } else {
            if (respInfo.statusCode === 200) {
              const fileUrl = `${this.domain}/${key}`;
              resolve({
                code: 201,
                message: 'success',
                data: {
                  key: fileUrl,
                },
              });
            } else {
              reject(new Error(`上传失败，状态码: ${respInfo.statusCode}`));
            }
          }
        }.bind(this),
      );
    });
  }
}