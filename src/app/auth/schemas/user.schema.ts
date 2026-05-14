import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  mobileNumber: string;

  @Prop()
  otp?: string;

  @Prop()
  otpExpires?: Date;

  @Prop()
  latitude?: number;

  @Prop()
  longitude?: number;

  @Prop()
  lastLoginDate?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
