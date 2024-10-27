import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { StudentProfileModule } from './student-profile/student-profile.module';
import { Student } from './student-profile/entitles/student-profile.entity';
import { StaffProfileModule } from './staff-profile/staff-profile.module';
import { Staff } from './staff-profile/entities/staff-profile.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT'), 10),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [UserEntity, Student, Staff],
        synchronize: configService.get('DB_SYNC') === 'true',
        ssl: configService.get('DB_SSL') === 'true',
        autoLoadEntities: configService.get('DB_AUTO_LOAD_ENTITIES') === 'true',
        logging: ['query', 'error'],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    StudentProfileModule,
    StaffProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
