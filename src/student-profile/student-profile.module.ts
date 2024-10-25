import { Module } from '@nestjs/common';
import { StudentProfileController } from './student-profile.controller';
import { StudentProfileService } from './student-profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entitles/student-profile.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [StudentProfileController],
  providers: [
    {
      provide: StudentProfileService,
      useClass: StudentProfileService,
    },
  ],
  exports: [StudentProfileService],
})
export class StudentProfileModule {}
