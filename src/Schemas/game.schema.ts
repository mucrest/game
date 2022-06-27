import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema()
export class Game {
  @Prop({ unique: true })
  id: string;

  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  publisher: string;

  @Prop([String])
  tags: [string];

  @Prop()
  releaseDate: Date;

  @Prop({default: false})
  discounted: Boolean;
}

export const GameSchema = SchemaFactory.createForClass(Game);
