import { Module } from '@nestjs/common';
import { StaffProfileController } from './staff-profile.controller';
import { StaffProfileService } from './staff-profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff-profile.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, UserEntity])],
  controllers: [StaffProfileController],
  providers: [StaffProfileService],
  exports: [StaffProfileService],
})
export class StaffProfileModule {}
