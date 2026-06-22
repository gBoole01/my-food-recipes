import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Recipe } from './dietitian-agent.types';

@Injectable()
export class RecipeRepositoryService {
  private recipes: Recipe[] = [];

  constructor() {
    // __dirname-relative joins (as used by PortfolioService) break depending on the
    // build mode: `nest build` emits dist/src/... (extra segment) and the webpack-based
    // `start --watch` bundle collapses __dirname differently again. process.cwd() is
    // stable across both since npm scripts always run from the project root.
    const filePath = join(process.cwd(), 'data', 'recipes.json');
    const fileData = readFileSync(filePath, 'utf-8');
    this.recipes = JSON.parse(fileData);
  }

  findAll(): Recipe[] {
    return this.recipes;
  }

  findByIds(ids: string[]): Recipe[] {
    const idSet = new Set(ids);
    return this.recipes.filter((recipe) => idSet.has(recipe.id));
  }
}
