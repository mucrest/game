import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './Schemas/game.schema';
import { Publisher, PublisherSchema } from './Schemas/publisher.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/game'),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    MongooseModule.forFeature([{ name: Publisher.name, schema: PublisherSchema }]),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
