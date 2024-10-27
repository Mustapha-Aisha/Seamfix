import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStaffProfileDto {
  @ApiProperty({ description: "Staff's first name" })
  @IsString()
  firstName: string;

  @ApiProperty({ description: "Staff's last name" })
  @IsString()
  lastName: string;

  @ApiProperty({ description: "Staff's email address" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Initial password for the staff' })
  @IsString()
  password: string;

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
