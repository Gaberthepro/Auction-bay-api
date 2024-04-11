import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Auction } from 'src/auctions/entities/auction.entity';
import { NewPassowrd } from 'src/interfaces/new_password';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;
    const user: User = new User();
    user.name = createUserDto.name;
    user.surname = createUserDto.surname;
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, saltOrRounds);
    user.imgURl = '';
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = new User();
    user.name = updateUserDto.name;
    user.surname = updateUserDto.surname;
    user.email = updateUserDto.email;
    user.password = updateUserDto.password;
    user.imgURl = updateUserDto.imgURl;
    user.id = id;
    return this.userRepository.save(user);
  }

  remove(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }

  async getUser(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async GetUserbyid(id: number): Promise<number> {
    const user = this.findOne(id);
    return (await user).id;
  }

  async UpdatePassword(new_passowrd_data: NewPassowrd) {
    const user = await this.findOne(new_passowrd_data.user_id);

    console.log(new_passowrd_data.old_password);
    const passwordValid = await bcrypt.compare(
      new_passowrd_data.old_password,
      user.password,
    );
    if (!passwordValid) {
      throw new Error('This is not your password');
    } else {
      const saltOrRounds = 10;
      user.password = await bcrypt.hash(
        new_passowrd_data.new_password,
        saltOrRounds,
      );
      return this.userRepository.save(user);
    }
  }
}
