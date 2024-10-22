import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { UserRepository } from './repo/user.repo';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) public userRepository: Repository<UserEntity>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      console.log('createuserdto', createUserDto);
      let user: UserEntity = this.userRepository.create(createUserDto);
      user.createdAt = new Date();
      user.updatedAt = new Date();
      console.log('user', user); 
       
      await this .userRepository.save(user);

      return user;

    } catch (error) {
      console.log('error', error);
      return error;
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
