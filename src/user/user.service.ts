import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, LoginDto, passwordResetDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { UserRepository } from './repo/user.repo';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) public userRepository: Repository<UserEntity>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      console.log('createuserdto', createUserDto);
      let saltRounds = 12;
      let salt = await bcrypt.genSalt(saltRounds);
      let password = await bcrypt.hash(createUserDto.password, salt);
      let user: UserEntity = this.userRepository.create(createUserDto);
      user.password = password;
      user.createdAt = new Date();
      user.updatedAt = new Date();
      
       
      await this.userRepository.save(user);

      return user;

    } catch (error) {
      console.log('error', error);
      return error;
    }
  }

  async login(data: LoginDto){
    console.log('loginDto', data);
    const user = await this.userRepository.findOne({ where: { username: data.username}})
    if (!user) {
      throw new NotFoundException(`User with username ${data.username} not found`);
    }
    const isPasswordMatch = await bcrypt.compare(data.password, user.password);
    if (!isPasswordMatch) {
      throw new NotFoundException(`Invalid password`);
    }
    return user;
  }

  async passwordReset(data: passwordResetDto){
    const user = await this.userRepository.findOne({ where: { email: data.email}})
    if (!user) {
      throw new NotFoundException(`User with username ${data.email} not found`);
    }
    if(data.password !== data.confirmPassword){throw new NotFoundException(`Password does not match`);}
    let saltRounds = 12;
      let salt = await bcrypt.genSalt(saltRounds);
      let password = await bcrypt.hash(data.password, salt);
    Object.assign(user, {password: data.password});
    return user;
  }

  async findAll() {
    const user = this.userRepository.find();
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async findOne(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId }

    });

    if (!user) {
      throw new NotFoundException(`User with ID ${ userId} not found`);
    }

    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${ userId} not found`);
    }

    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }
    
  
  async remove(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${ userId} not found`);
    }

     await this.userRepository.remove(user);
     return "user removed successfully";
  }
}
