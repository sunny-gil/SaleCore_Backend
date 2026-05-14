import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Tracking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const TrackingSchema = SchemaFactory.createForClass(Tracking);

@Schema({ timestamps: true })
export class Activity extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ default: Date.now })
  endTime: Date;

  @Prop({ default: 0 })
  durationInMinutes: number;

  @Prop({ default: 0 })
  distanceFromLastStop: number; // in KM
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
