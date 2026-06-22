import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, RecipeIngredient])],
  exports: [TypeOrmModule],
})
export class RecipesModule {}
