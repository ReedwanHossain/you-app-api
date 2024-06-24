import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class Horoscope {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  zodiac: string;

  @Prop({ required: true })
  period: string;
}

@Schema()
export class Profile extends mongoose.Document {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  displayName: string;

  @Prop({ required: true, enum: Gender })
  gender: string;

  @Prop({ required: true })
  birthday: string;

  @Prop({ required: true, type: Horoscope })
  horoscope: Horoscope;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  weight: number;

  @Prop({ type: [String], required: true })
  interests: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
