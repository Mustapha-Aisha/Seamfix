import { CreateStaffProfileDto } from '../dto/create-staff-profile.dto';
import { Staff } from '../entities/staff-profile.entity';
import { UpdateStaffProfileDto } from '../dto/update-staff-profile-dto';
import { DeleteResponseInterface } from './DeleteResponse.interface';

export interface StaffProfileServiceInterface {
  createStaffProfile(
    userId: number,
    createStaffProfileDto: CreateStaffProfileDto,
  ): Promise<Staff>;

  updateStaffProfile(
    userId: number,
    staffId: string,
    updateStaffProfileDto: UpdateStaffProfileDto,
  ): Promise<Staff>;

  getStaffProfiles(userId: number): Promise<Staff[]>;

  getStaffProfile(userId: number, staffId: string): Promise<Staff>;

  deleteStaffProfile(
    userId: number,
    staffId: string,
  ): Promise<DeleteResponseInterface>;
}
