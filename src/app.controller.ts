import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { AppGuard } from './app.guard';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All('auth/*')
  async redirectToAuth(@Req() request: Request, @Res() response: Response) {
    const { method, url, headers, body } = request;
    const result = await this.appService.sendReqToService(
      {
        method,
        url,
        headers,
        body,
      },
      'auth',
    );
    return response.status(result.status).send(result.data);
  }

  @UseGuards(AppGuard)
  @All('chat/*')
  async redirectToChat(@Req() request: Request, @Res() response: Response) {
    const { method, url, body } = request;
    const result = await this.appService.sendReqToService(
      {
        method,
        url,
        body,
        userId: request['userId'],
      },
      'chat',
    );
    return response.status(result.status).send(result.data);
  }
}
