import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AppService {
  private readonly SERVICES_URL = {
    auth: this.configService.get<string>('AUTH_SERVICE_URL'),
    chat: this.configService.get<string>('CHAT_SERVICE_URL'),
  };
  constructor(private readonly configService: ConfigService) {}

  async sendReqToService(
    req: Record<string, any>,
    service: string,
  ): Promise<{ status: number; data: Record<string, any> }> {
    try {
      const res = await axios({
        url: `${this.SERVICES_URL[service]}${req.url}`,
        method: req.method,
        data: req.body,
        headers: {
          'x-user-id': req.userId,
        }
      });
      return { status: res.status, data: res.data };
    } catch (error) {
      return {
        status: error.response?.status || 500,
        data: error.response?.data || 'An error occurred',
      };
    }
  }
}
