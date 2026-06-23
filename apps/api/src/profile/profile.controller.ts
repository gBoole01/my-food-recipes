import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  HouseholdRegistrationRequestSchema,
  MemberInputSchema,
  MemberUpdateRequestSchema,
} from '@my-food-recipes/contracts';
import { ProfileService } from './profile.service';

@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async register(@Body() body: unknown) {
    const input = HouseholdRegistrationRequestSchema.parse(body);
    return this.profileService.registerHousehold(input);
  }

  @Get()
  async get() {
    return this.profileService.getHousehold();
  }

  @Post('members')
  async addMember(@Body() body: unknown) {
    const input = MemberInputSchema.parse(body);
    return this.profileService.addMember(input);
  }

  @Patch('members/:memberId')
  async updateMember(
    @Param('memberId') memberId: string,
    @Body() body: unknown,
  ) {
    const input = MemberUpdateRequestSchema.parse(body);
    return this.profileService.updateMember(memberId, input);
  }

  @Delete('members/:memberId')
  async removeMember(@Param('memberId') memberId: string) {
    await this.profileService.removeMember(memberId);
    return { success: true };
  }
}
