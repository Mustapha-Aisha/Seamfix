import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StaffProfileService } from './staff-profile.service';
import { CreateStaffProfileDto } from './dto/create-staff-profile.dto';

ApiTags('Staff Profile');

@Controller('staff-profile')
export class StaffProfileController {
  constructor(private readonly staffProfileService: StaffProfileService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new staff profile' })
  @ApiResponse({
    status: 201,
    description: 'Staff record has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createStaffProfile(
    @Param('userId') userId: number,
    @Body() createStaffProfileDto: CreateStaffProfileDto,
  ) {
    return await this.staffProfileService.createStaffProfile(
      userId,
      createStaffProfileDto,
    );
  }
}
