import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PublisherDocument = Publisher & Document;

@Schema()
export class Publisher {
  @Prop({ unique: true })
  id: string;

  @Prop()
  name: string;

  @Prop()
  siret: number;

  @Prop()
  phone: string;

}

export const PublisherSchema = SchemaFactory.createForClass(Publisher);
