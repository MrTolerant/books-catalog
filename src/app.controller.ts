import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async redirectToPlayground(@Res() res: Response) {
    return res.redirect('http://localhost:3000/graph');
  }
}
