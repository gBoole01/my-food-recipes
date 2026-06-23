import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesModule } from '../recipes/recipes.module';
import { Household } from './household.entity';
import { HouseholdEquipment } from './household-equipment.entity';
import { HouseholdPantryStaple } from './household-pantry-staple.entity';
import { MemberAllergen } from './member-allergen.entity';
import { MemberExcludedIngredient } from './member-excluded-ingredient.entity';
import { MemberProfile } from './member-profile.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { RecipeFeedback } from './recipe-feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Household,
      HouseholdEquipment,
      HouseholdPantryStaple,
      MemberProfile,
      MemberAllergen,
      MemberExcludedIngredient,
      RecipeFeedback,
    ]),
    RecipesModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
