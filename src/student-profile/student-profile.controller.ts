import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { StudentProfileService } from './student-profile.service';

@ApiTags('Student Profile')
@Controller('student-profile')
export class StudentProfileController {
  constructor(private readonly studentProfileService: StudentProfileService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a student profile for existing user' })
  @ApiResponse({
    status: 201,
    description: 'Student profile successfully created',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  async createStudentProfile(
    @Param('userId') userId: number,
    @Body() createStudentProfileDto: CreateStudentProfileDto,
  ) {
    return await this.studentProfileService.createStudentProfile(
      userId,
      createStudentProfileDto,
    );
  }

  // update student profile
  @Put(':userId/update')
  @ApiOperation({ summary: 'Update a student profile for existing user' })
  @ApiResponse({
    status: 200,
    description: 'Student profile successfully updated',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  async updateStudentProfile(
    @Param('userId') userId: number,
    @Param('studentId') studentId: string,
    @Body() createStudentProfileDto: CreateStudentProfileDto,
  ) {
    return await this.studentProfileService.updateStudentProfile(
      userId,
      studentId,
      createStudentProfileDto,
    );
  }
}
