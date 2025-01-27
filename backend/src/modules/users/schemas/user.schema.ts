import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & mongoose.Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export default class User {
  @Prop({ nullable: false })
  firstName!: string;

  @Prop({ nullable: false })
  lastName!: string;

  @Prop({ nullable: true })
  password!: string;

  @Prop({ nullable: false, unique: true })
  email!: string;

  @Prop({ type: Date, default: Date.now }) joinedAt!: Date;

  @Prop({ nullable: false }) strategy!: string;

  @Prop({ nullable: true })
  currentHashedRefreshToken?: string;

  @Prop({ nullable: true, default: false })
  isSAdmin!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
