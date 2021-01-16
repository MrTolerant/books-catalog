import { Controller, Get, Redirect, Res } from '@nestjs/common';
import { AppService } from './app.service';

// const redirectUrl = `http://localhost:${process.env['REDIRECT_PORT'] || 3000}/graphql`
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  //   @Redirect(redirectUrl)
  // async redirectToPlayground() {}
}
