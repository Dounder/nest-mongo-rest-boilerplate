import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserRole } from '../enums/user-role.enum';

@Schema({ timestamps: true })
export class User extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true, minlength: 8, maxlength: 200 })
  @Exclude()
  password: string;

  @Prop({ type: String, required: true, unique: true, minlength: 8, maxlength: 50 })
  email: string;

  @Prop({ type: String, required: true, minlength: 2, maxlength: 20 })
  name: string;

  @Prop({ type: String, required: true, minlength: 2, maxlength: 20 })
  lastName: string;

  @Prop({ type: [String], enum: UserRole, default: UserRole.USER })
  roles: UserRole[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: function (_, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

UserSchema.set('toObject', {
  transform: function (_, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});
