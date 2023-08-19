import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { isMongoId } from 'class-validator';
import { Model } from 'mongoose';

import { CustomError } from '../common/helpers';
import { ExceptionHandler } from '../common/helpers/exception-handler.helper';
import { PaginationDto } from './../common/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...userData } = createUserDto;
      const user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      delete user.password;

      return user;
    } catch (error) {
      ExceptionHandler(error);
    }
  }

  async findAll(pagination: PaginationDto): Promise<User[]> {
    const { limit, offset } = pagination;

    const users = await this.userModel.find().select('-password').skip(offset).limit(limit);

    return users;
  }

  async findOneBy(term: string): Promise<User> {
    try {
      const user = isMongoId(term)
        ? await this.userModel.findById(term).select('-password')
        : await this.userModel.findOne({ username: term }).select('-password');

      if (!user) throw new CustomError({ message: 'User not found', code: 404 });

      return user;
    } catch (error) {
      ExceptionHandler(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);

    const user = await this.userModel.findOneAndUpdate({ _id: id }, updateUserDto, { new: true }).select('-password');

    if (!user) throw new CustomError({ message: 'User not found', code: 404 });

    if (user.deletedAt) throw new BadRequestException(`User ${user.username} is inactive, you cannot update it`);

    return user;
  }

  async remove(currentUser: User, id: string): Promise<{ msg: string }> {
    const user = await this.findOneBy(id);

    if (user.id === currentUser.id) throw new UnauthorizedException(`You cannot delete yourself`);

    if (user.deletedAt) throw new BadRequestException(`User ${user.username} is already inactive`);

    user.deletedAt = new Date();

    await user.save();

    return { msg: `User ${user.username} deleted successfully` };
  }

  async restore(id: string): Promise<{ msg: string }> {
    const user = await this.findOneBy(id);

    if (!user.deletedAt) throw new BadRequestException(`User ${user.username} is not inactive`);

    user.deletedAt = null;

    await user.save();

    return { msg: `User ${user.username} restored successfully` };
  }
}
