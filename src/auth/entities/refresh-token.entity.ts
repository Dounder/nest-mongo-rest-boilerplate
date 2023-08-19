import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from './../../users/entities/user.entity';

@Schema({ timestamps: true })
export class RefreshToken extends BaseEntity {
  @Prop({ type: String })
  token: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
