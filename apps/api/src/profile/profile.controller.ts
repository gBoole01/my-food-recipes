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
  EquipmentPatchRequestSchema,
  HouseholdRegistrationRequestSchema,
  MemberInputSchema,
  MemberUpdateRequestSchema,
  PantryPatchRequestSchema,
  RestrictionsPatchRequestSchema,
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

  @Patch('equipment')
  async updateEquipment(@Body() body: unknown) {
    const input = EquipmentPatchRequestSchema.parse(body);
    return this.profileService.updateEquipment(input);
  }

  @Patch('pantry')
  async updatePantry(@Body() body: unknown) {
    const input = PantryPatchRequestSchema.parse(body);
    return this.profileService.updatePantry(input);
  }

  @Patch('members/:memberId/restrictions')
  async updateRestrictions(
    @Param('memberId') memberId: string,
    @Body() body: unknown,
  ) {
    const input = RestrictionsPatchRequestSchema.parse(body);
    return this.profileService.updateRestrictions(memberId, input);
  }
}
