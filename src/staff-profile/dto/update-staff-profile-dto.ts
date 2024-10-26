import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffProfileDto } from './create-staff-profile.dto';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStaffProfileDto extends PartialType(
  OmitType(CreateStaffProfileDto, [] as const),
) {
  @ApiProperty({ description: "Staff's first name" })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: "Staff's last name" })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: "Staff's email address" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Initial password for the staff' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ description: "Staff's date of birth" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @ApiPropertyOptional({ description: "Staff's address" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: "Staff's phone number" })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: "Staff's role status" })
  @IsOptional()
  @IsString()
  role?: string;
}
