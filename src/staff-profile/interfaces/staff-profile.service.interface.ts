import { CreateStaffProfileDto } from '../dto/create-staff-profile.dto';
import { Staff } from '../entities/staff-profile.entity';

export interface StaffProfileServiceInterface {
  createStaffProfile(
    userId: number,
    createStaffProfileDto: CreateStaffProfileDto,
  ): Promise<Staff>;
}
