import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export abstract class BaseEntity extends Document {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updateAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}
