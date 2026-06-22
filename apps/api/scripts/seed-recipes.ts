import { readFileSync } from 'fs';
import { join } from 'path';
import { RecipeCorpusSchema } from '@my-food-recipes/contracts';

function main(): void {
  const filePath = join(__dirname, '..', 'data', 'recipes.json');
  const raw = readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);

  const result = RecipeCorpusSchema.safeParse(data);

  if (!result.success) {
    console.error(`Invalid recipe corpus at ${filePath}:`);
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }

  const ids = new Set<string>();
  const duplicates: string[] = [];
  for (const recipe of result.data) {
    if (ids.has(recipe.id)) duplicates.push(recipe.id);
    ids.add(recipe.id);
  }

  if (duplicates.length > 0) {
    console.error(`Duplicate recipe ids found: ${duplicates.join(', ')}`);
    process.exit(1);
  }

  console.log(
    `Recipe corpus valid: ${result.data.length} recipes loaded from ${filePath}.`,
  );
}

main();
