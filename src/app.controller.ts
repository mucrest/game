import { Body, Controller, Delete, Get, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService, FetchGameById } from './app.service';
import { GameDocument } from './Schemas/game.schema';
import { PublisherDocument } from './Schemas/publisher.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('game/fetch')
  get(@Body() body: FetchGameById, @Res() response: Response): any {
    return this.appService.get(body, response);
  }

  @Post('game/create')
  create(@Body() body: GameDocument, @Res() response: Response): any {
    return this.appService.create(body, response);
  }

  @Post('publisher/create')
  createPublisher(@Body() body: PublisherDocument, @Res() response: Response): any {
    return this.appService.createPublisher(body, response);
  }

  @Put('game/update')
  updatee(@Body() body: GameDocument, @Res() response: Response): any {
    return this.appService.update(body, response);
  }

  @Delete('game/delete')
  delete(@Body() body: FetchGameById, @Res() response: Response): any {
    return this.appService.delete(body, response);
  }
}
