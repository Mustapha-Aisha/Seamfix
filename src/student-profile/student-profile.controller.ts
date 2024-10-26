import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createStudentProfile(
    @Param('userId') userId: number,
    @Body() createStudentProfileDto: CreateStudentProfileDto,
  ) {
    return await this.studentProfileService.createStudentProfile(
      userId,
      createStudentProfileDto,
    );
  }

  @Put(':userId/update')
  @ApiOperation({ summary: 'Update a student profile for existing user' })
  @ApiResponse({
    status: 200,
    description: 'Student profile successfully updated',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

  @Get(':userId/profiles')
  @ApiOperation({ summary: 'Get student profiles for existing user' })
  @ApiResponse({
    status: 200,
    description: 'Student profiles successfully retrieved',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStudentProfiles(@Param('userId') userId: number) {
    return await this.studentProfileService.getStudentProfiles(userId);
  }

  @Get(':userId/profiles/:studentId')
  @ApiOperation({ summary: 'Get student profile for existing user' })
  @ApiResponse({
    status: 200,
    description: 'Student profile successfully retrieved',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStudentProfile(
    @Param('userId') userId: number,
    @Param('studentId') studentId: string,
  ) {
    return await this.studentProfileService.getStudentProfile(
      userId,
      studentId,
    );
  }

  @Delete(':userId/profiles/:studentId')
  @ApiOperation({ summary: 'Delete student profile for existing user' })
  @ApiResponse({
    status: 200,
    description: 'Student profile successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteStudentProfile(
    @Param('userId') userId: number,
    @Param('studentId') studentId: string,
  ) {
    return await this.studentProfileService.deleteStudentProfile(
      userId,
      studentId,
    );
  }
}
