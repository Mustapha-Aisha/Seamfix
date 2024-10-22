import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { query } from 'express';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres', 
    autoLoadEntities: true,
    logging:['query', 'error'],   
    ssl: false,          // Database type
    host: 'localhost',             // Database host
    port: 5432,                    // Default PostgreSQL port
    username: 'postgres',      // Your PostgreSQL username
    password: 'postgres',      // Your PostgreSQL password
    database: 'seamfix',
    entities:[UserEntity],      // Your PostgreSQL database name
    synchronize: true,             // Set to false in production
  })
  ,UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}