import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentProfileDto } from './create-student-profile.dto';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnrollmentStatus } from '../entitles/student-profile.entity';

export class UpdateStudentProfileDto extends PartialType(
  OmitType(CreateStudentProfileDto, [] as const),
) {
  @ApiProperty({ description: "Student's first name" })
  @IsString()
  firstName?: string;

  @ApiProperty({ description: "Student's last name" })
  @IsString()
  lastName?: string;

  @ApiProperty({ description: "Student's email address" })
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Initial password for the student' })
  @IsString()
  password?: string;

  @ApiPropertyOptional({ description: "Student's date of birth" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @ApiPropertyOptional({ description: "Student's address" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: "Student's phone number" })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: "Student's enrollment status",
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  enrollmentStatus?: EnrollmentStatus;
}
