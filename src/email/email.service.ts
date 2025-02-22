import { Injectable } from '@nestjs/common';
import { createTransport, Transporter} from 'nodemailer';

@Injectable()
export class EmailService {

    transporter: Transporter
    
    constructor() {
      this.transporter = createTransport({
          host: "smtp.126.com",
          port: 587,
          secure: false,
          auth: {
              user: 'minerchow@126.com',
              pass: 'KJyFkr46PKjXuD5M'
          },
      });
    }

    async sendMail({ to, subject, html }) {
      await this.transporter.sendMail({
        from: {
          name: '会议室预定系统',
          address: 'minerchow@qq.com'
        },
        to,
        subject,
        html
      });
    }
}