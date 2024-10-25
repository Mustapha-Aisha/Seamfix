import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entitles/student-profile.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { StudentProfileServiceInterface } from './interfaces/student-profile-service.interface';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';

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
    // find user
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // check if student profile already exists
    const existingProfile = await this.studentRepo.findOne({
      where: { user: { id: userId } },
    });

    if (existingProfile) {
      throw new ConflictException(
        'Student profile already exists for this user',
      );
    }

    // create student profile
    const studentProfile = new Student();
    studentProfile.user = user;
    studentProfile.firstName = createStudentProfileDto.firstName;
    studentProfile.lastName = createStudentProfileDto.lastName;
    studentProfile.email = createStudentProfileDto.email;
    studentProfile.password = createStudentProfileDto.password;
    studentProfile.studentId = createStudentProfileDto.studentId;
    studentProfile.enrollmentStatus = createStudentProfileDto.enrollmentStatus;
    studentProfile.dateOfBirth = createStudentProfileDto.dateOfBirth;
    studentProfile.address = createStudentProfileDto.address;
    studentProfile.phoneNumber = createStudentProfileDto.phoneNumber;

    await this.studentRepo.save(studentProfile);
    return studentProfile;
  }

  async updateStudentProfile(
    userId: number,
    studentId: string,
    updateStudentProfileDto: UpdateStudentProfileDto,
  ): Promise<Student> {
    // find user
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // find student profile
    const studentProfile = await this.studentRepo.findOne({
      where: { user: { id: userId }, studentId: studentId },
    });

    if (!studentProfile) {
      throw new NotFoundException('Student profile not found');
    }

    // update student profile
    studentProfile.firstName = updateStudentProfileDto.firstName;
    studentProfile.lastName = updateStudentProfileDto.lastName;
    studentProfile.email = updateStudentProfileDto.email;
    studentProfile.password = updateStudentProfileDto.password;
    studentProfile.studentId = updateStudentProfileDto.studentId;
    studentProfile.enrollmentStatus = updateStudentProfileDto.enrollmentStatus;
    studentProfile.dateOfBirth = updateStudentProfileDto.dateOfBirth;
    studentProfile.address = updateStudentProfileDto.address;
    studentProfile.phoneNumber = updateStudentProfileDto.phoneNumber;

    await this.studentRepo.save(studentProfile);
    return studentProfile;
  }
}
