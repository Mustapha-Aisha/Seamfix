import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff-profile.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CreateStaffProfileDto } from './dto/create-staff-profile.dto';
import * as bcrypt from 'bcrypt';
import { CreateStudentProfileDto } from '../student-profile/dto/create-student-profile.dto';
import { StaffProfileServiceInterface } from './interfaces/staff-profile.service.interface';
import { UpdateStaffProfileDto } from './dto/update-staff-profile-dto';
import { DeleteResponseInterface } from './interfaces/DeleteResponse.interface';

@Injectable()
export class StaffProfileService implements StaffProfileServiceInterface {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createStaffProfile(
    userId: number,
    createStaffProfileDto: CreateStaffProfileDto,
  ): Promise<Staff> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'admin') {
      throw new UnauthorizedException(
        'Only admin users can create staff profiles',
      );
    }

    const existingEmail = await this.staffRepository.findOne({
      where: { email: createStaffProfileDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    if (!this.validateRequiredFields(createStaffProfileDto)) {
      throw new BadRequestException('All fields are required');
    }

    // Generate unique staff ID
    const staffId = await this.ensureUniqueStaffId();

    const staffProfile = this.staffRepository.create({
      ...createStaffProfileDto,
      staffId,
      user,
      password: await this.hashPassword(createStaffProfileDto.password),
    });

    return await this.staffRepository.save(staffProfile);
  }

  async updateStaffProfile(
    userId: number,
    staffId: string,
    updateStaffProfileDto: UpdateStaffProfileDto,
  ): Promise<Staff> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'admin') {
      throw new UnauthorizedException(
        'Only admin users can update staff profiles',
      );
    }

    // Find staff profile created by the admin
    const staffProfile = await this.staffRepository.findOne({
      where: { staffId, user: { id: userId } },
    });

    if (!staffProfile) {
      throw new NotFoundException(
        'Staff profile not found or you do not have permission to update it',
      );
    }

    // Check email uniqueness if  being updated
    if (
      updateStaffProfileDto.email &&
      updateStaffProfileDto.email !== staffProfile.email
    ) {
      const existingEmail = await this.staffRepository.findOne({
        where: { email: updateStaffProfileDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Update staff profile
    const updatedStaffProfile = {
      ...staffProfile,
      ...updateStaffProfileDto,
      staffId: staffProfile.staffId,
      password: updateStaffProfileDto.password
        ? await this.hashPassword(updateStaffProfileDto.password)
        : staffProfile.password,
    };

    return await this.staffRepository.save(updatedStaffProfile);
  }

  async getStaffProfiles(userId: number): Promise<Staff[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'admin') {
      throw new BadRequestException(
        'Only admin users can view all student profiles',
      );
    }

    return await this.staffRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getStaffProfile(userId: number, staffId: string): Promise<Staff> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'admin') {
      throw new BadRequestException(
        'Only admin users can view student profiles',
      );
    }

    const staffProfile = await this.staffRepository.findOne({
      where: {
        staffId,
        user: { id: userId },
      },
    });

    if (!staffProfile) {
      throw new NotFoundException(
        'Student profile not found or you do not have permission to view it',
      );
    }

    return staffProfile;
  }

  async deleteStaffProfile(
    userId: number,
    staffId: string,
  ): Promise<DeleteResponseInterface> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'admin') {
      throw new BadRequestException(
        'Only admin users can delete student profiles',
      );
    }

    // Check if the student profile exists and belongs to this admin
    const studentProfile = await this.staffRepository.findOne({
      where: {
        staffId,
        user: { id: userId },
      },
    });

    console.log('Retrieved Student Profiles:', studentProfile);

    if (!studentProfile) {
      throw new NotFoundException(
        'Student profile not found or you do not have permission to delete it',
      );
    }

    await this.staffRepository.remove(studentProfile);

    return {
      success: true,
      message: `Staff profile with ID ${staffId} has been successfully deleted`,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private validateRequiredFields(dto: CreateStudentProfileDto): boolean {
    return !!(
      dto.firstName &&
      dto.lastName &&
      dto.email &&
      dto.password &&
      dto.dateOfBirth &&
      dto.address &&
      dto.phoneNumber
    );
  }

  private generateStudentId(): string {
    const year = new Date().getFullYear().toString().slice(-2);
    const randomDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `STF${year}${randomDigits}`;
  }

  private async ensureUniqueStaffId(): Promise<string> {
    let staffId: string;
    let isUnique = false;

    while (!isUnique) {
      staffId = this.generateStudentId();
      const existing = await this.staffRepository.findOne({
        where: { staffId: staffId },
      });
      if (!existing) {
        isUnique = true;
      }
    }

    return staffId;
  }
}
