import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
// import { UserRepository } from './repo/user.repo';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    
  ],
  controllers: [UserController],
  providers: [UserService, Repository],
})
export class UserModule {}
