import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StaffProfileService } from './staff-profile.service';
import { CreateStaffProfileDto } from './dto/create-staff-profile.dto';
import { UpdateStaffProfileDto } from './dto/update-staff-profile-dto';
import { Staff } from './entities/staff-profile.entity';

@ApiTags('Staff Profile')
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
  ): Promise<Staff> {
    return await this.staffProfileService.createStaffProfile(
      userId,
      createStaffProfileDto,
    );
  }

  @Put(':userId/update')
  @ApiOperation({ summary: 'Update a staff profile' })
  @ApiExtraModels(CreateStaffProfileDto)
  @ApiResponse({
    status: 200,
    description: 'Staff record has been successfully updated',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateStaffProfile(
    @Param('userId') userId: number,
    @Param('staffId') staffId: string,
    @Body() updateStaffProfileDto: UpdateStaffProfileDto,
  ): Promise<Staff> {
    return this.staffProfileService.updateStaffProfile(
      userId,
      staffId,
      updateStaffProfileDto,
    );
  }

  @Get(':userId/staff')
  @ApiOperation({ summary: 'Get all staff profiles' })
  @ApiResponse({
    status: 200,
    description: 'Staff profiles have been successfully retrieved',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStaffProfiles(@Param('userId') userId: number) {
    return await this.staffProfileService.getStaffProfiles(userId);
  }

  @Get(':userId/staff/:staffId')
  @ApiOperation({ summary: 'Get a staff profile' })
  @ApiResponse({
    status: 200,
    description: 'Staff profile has been successfully retrieved',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStaffProfile(
    @Param('userId') userId: number,
    @Param('staffId') staffId: string,
  ) {
    return await this.staffProfileService.getStaffProfile(userId, staffId);
  }

  @Delete(':userId/staff/:staffId')
  @ApiOperation({ summary: 'Delete a staff profile' })
  @ApiResponse({
    status: 200,
    description: 'Staff profile has been successfully deleted',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteStaffProfile(
    @Param('userId') userId: number,
    @Param('staffId') staffId: string,
  ) {
    return await this.staffProfileService.deleteStaffProfile(userId, staffId);
  }
}
