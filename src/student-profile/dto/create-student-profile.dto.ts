import { IsString, IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsDate } from 'class-validator';
import { EnrollmentStatus } from '../entitles/student-profile.entity';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentProfileDto {
  @ApiProperty({ description: 'Student\'s first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Student\'s last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Student\'s email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Initial password for the student' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Student ID number' })
  @IsString()
  studentId: string;

  @ApiPropertyOptional({ description: 'Student\'s date of birth' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @ApiPropertyOptional({ description: 'Student\'s address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Student\'s phone number' })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Student\'s enrollment status',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  enrollmentStatus?: EnrollmentStatus;
}
