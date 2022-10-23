import { UserRequestDto } from './dto/users.request.dto';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async existByEamil(email: string): Promise<object> {
    const result = await this.userModel.exists({ email });
    return result;
  }

  async create(user: UserRequestDto): Promise<User> {
    return await this.userModel.create(user);
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findUserByIdWidhoutPassword(userId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId).select('-password');

    return user;
  }
}
