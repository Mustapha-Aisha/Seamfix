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
