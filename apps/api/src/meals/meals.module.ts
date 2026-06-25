import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseholdEquipment } from '../profile/household-equipment.entity';
import { MemberAllergen } from '../profile/member-allergen.entity';
import { MemberExcludedIngredient } from '../profile/member-excluded-ingredient.entity';
import { MemberProfile } from '../profile/member-profile.entity';
import { RecipeFeedback } from '../profile/recipe-feedback.entity';
import { RecipeIngredient } from '../recipes/recipe-ingredient.entity';
import { Recipe } from '../recipes/recipe.entity';
import { AntiRedundancyService } from './anti-redundancy.service';
import { RecipeFilterService } from './recipe-filter.service';
import { UserPlanning } from './user-planning.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserPlanning,
      Recipe,
      RecipeIngredient,
      MemberProfile,
      MemberAllergen,
      MemberExcludedIngredient,
      HouseholdEquipment,
      RecipeFeedback,
    ]),
  ],
  providers: [RecipeFilterService, AntiRedundancyService],
  exports: [RecipeFilterService],
})
export class MealsModule {}
