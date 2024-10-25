import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { query } from 'express';
import { CourseModule } from './course/course.module';
import * as dotenv from 'dotenv';
dotenv.config();


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres', 
    autoLoadEntities: true,
    logging:['query', 'error'],   
    ssl: false,          
    host: 'localhost',            
    port: 5432,                   
    username: process.env.username ,     
    password: process.env.password,     
    database: process.env.database,
    entities:[UserEntity],      
    synchronize: true,           
  })
  ,UserModule, CourseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}