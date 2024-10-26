import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { StudentProfileServiceInterface } from './interfaces/student-profile-service.interface';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import * as bcrypt from 'bcrypt';
import { Student } from './entitles/student-profile.entity';

@Injectable()
export class StudentProfileService implements StudentProfileServiceInterface {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async createStudentProfile(
    userId: number,
    createStudentProfileDto: CreateStudentProfileDto,
  ): Promise<Student> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'admin') {
      throw new BadRequestException(
        'Only admin users can create student profiles',
      );
    }

    const existingStudentId = await this.studentRepo.findOne({
      where: { studentId: createStudentProfileDto.studentId },
    });

    if (existingStudentId) {
      throw new ConflictException('Student ID already exists');
    }

    const existingEmail = await this.studentRepo.findOne({
      where: { email: createStudentProfileDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    if (!this.validateRequiredFields(createStudentProfileDto)) {
      throw new BadRequestException('All fields are required');
    }

    const studentProfile = this.studentRepo.create({
      ...createStudentProfileDto,
      user,
      password: await this.hashPassword(createStudentProfileDto.password),
    });

    return await this.studentRepo.save(studentProfile);
  }

  async updateStudentProfile(
    userId: number,
    studentId: string,
    updateStudentProfileDto: UpdateStudentProfileDto,
  ): Promise<Student> {
    // Find user and validate admin status
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'admin') {
      throw new BadRequestException(
        'Only admin users can update student profiles',
      );
    }

    // Find student profile created by this admin
    const studentProfile = await this.studentRepo.findOne({
      where: {
        studentId,
        user: { id: userId },
      },
    });

    if (!studentProfile) {
      throw new NotFoundException(
        'Student profile not found or you do not have permission to update it',
      );
    }

    // Check if studentId in DTO matches the current studentId
    if (
      updateStudentProfileDto.studentId &&
      updateStudentProfileDto.studentId !== studentProfile.studentId
    ) {
      throw new ForbiddenException('Student ID cannot be modified');
    }

    // Check email uniqueness if being updated
    if (
      updateStudentProfileDto.email &&
      updateStudentProfileDto.email !== studentProfile.email
    ) {
      const existingEmail = await this.studentRepo.findOne({
        where: { email: updateStudentProfileDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Create updated profile object
    const updatedProfile = {
      ...studentProfile,
      ...updateStudentProfileDto,
      studentId: studentProfile.studentId, // Ensure original studentId is kept
      password: updateStudentProfileDto.password
        ? await this.hashPassword(updateStudentProfileDto.password)
        : studentProfile.password,
    };

    return await this.studentRepo.save(updatedProfile);
  }

  async getStudentProfiles(userId: number): Promise<Student[]> {
    const user = await this.userRepo.findOne({
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

    return await this.studentRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getStudentProfile(userId: number, studentId: string): Promise<Student> {
    const user = await this.userRepo.findOne({
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

    const studentProfile = await this.studentRepo.findOne({
      where: {
        studentId,
        user: { id: userId },
      },
    });

    if (!studentProfile) {
      throw new NotFoundException(
        'Student profile not found or you do not have permission to view it',
      );
    }

    return studentProfile;
  }

  async deleteStudentProfile(userId: number, studentId: string): Promise<void> {
    const user = await this.userRepo.findOne({
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
    const studentProfile = await this.studentRepo.findOne({
      where: {
        studentId,
        user: { id: userId },
      },
    });

    if (!studentProfile) {
      throw new NotFoundException(
        'Student profile not found or you do not have permission to delete it',
      );
    }

    await this.studentRepo.remove(studentProfile);
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
      dto.studentId &&
      dto.dateOfBirth &&
      dto.address &&
      dto.phoneNumber
    );
  }
}
