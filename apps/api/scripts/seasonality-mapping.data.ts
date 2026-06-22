import { SeasonalityType } from '../src/seasonality/seasonality.entity';

export interface SeasonalityMappingEntry {
  month: number;
  type: SeasonalityType;
  name: string;
}

interface MonthEntry {
  month: number;
  legumes: string[];
  fruits: string[];
}

// Source : ADEME, infographie "À chaque mois ses fruits et légumes" (apps/api/seeds/Fruits et légumes mensuels.pdf).
// Noms normalisés (minuscules, sans accents, singulier) pour rester cohérents avec
// apps/api/scripts/ingredient-alias-mapping.data.ts. Les variantes orthographiques du
// PDF source (chou/choux, carotte/carottes, champignon(s) de paris, echalotte/echalote)
// sont fusionnées sous une seule forme canonique pour qu'un même ingrédient reste
// reconnaissable d'un mois à l'autre.
const MONTHS: MonthEntry[] = [
  {
    month: 1,
    legumes: [
      'betterave', 'carotte', 'celeri', 'champignon de paris', 'chou',
      'chou de bruxelles', 'chou-fleur', 'courge', 'cresson', 'endive',
      'epinard', 'mache', 'navet', 'oignon', 'panais', 'poireau', 'potiron',
      'salsifis', 'topinambour',
    ],
    fruits: ['citron', 'clementine', 'kaki', 'kiwi', 'mandarine', 'orange', 'poire', 'pomme'],
  },
  {
    month: 2,
    legumes: [
      'betterave', 'carotte', 'celeri', 'champignon de paris', 'chou',
      'chou de bruxelles', 'chou-fleur', 'cresson', 'endive', 'epinard',
      'mache', 'navet', 'oignon', 'panais', 'poireau', 'salsifis', 'topinambour',
    ],
    fruits: ['citron', 'clementine', 'kiwi', 'mandarine', 'orange', 'pamplemousse', 'poire', 'pomme'],
  },
  {
    month: 3,
    legumes: [
      'betterave', 'carotte', 'celeri', 'champignon de paris', 'chou',
      'chou de bruxelles', 'chou-fleur', 'cresson', 'endive', 'epinard',
      'navet', 'oignon', 'panais', 'poireau', 'radis',
    ],
    fruits: ['kiwi', 'orange', 'pamplemousse', 'poire', 'pomme'],
  },
  {
    month: 4,
    legumes: [
      'asperge', 'betterave', 'champignon de paris', 'cresson', 'endive',
      'epinard', 'fenouil', 'navet', 'oignon', 'poireau', 'radis', 'salade',
    ],
    fruits: ['pamplemousse', 'pomme', 'rhubarbe'],
  },
  {
    month: 5,
    legumes: [
      'artichaut', 'asperge', 'champignon de paris', 'concombre', 'courgette',
      'cresson', 'epinard', 'navet', 'petit pois', 'radis', 'salade',
    ],
    fruits: ['fraise', 'pamplemousse', 'rhubarbe'],
  },
  {
    month: 6,
    legumes: [
      'artichaut', 'asperge', 'aubergine', 'blette', 'champignon de paris',
      'concombre', 'courgette', 'fenouil', 'haricot vert', 'petit pois',
      'poivron', 'radis', 'tomate', 'salade',
    ],
    fruits: [
      'abricot', 'cassis', 'cerise', 'fraise', 'framboise', 'groseille',
      'melon', 'pamplemousse', 'pasteque', 'peche', 'rhubarbe',
    ],
  },
  {
    month: 7,
    legumes: [
      'ail', 'artichaut', 'aubergine', 'blette', 'champignon de paris',
      'concombre', 'courgette', 'fenouil', 'haricot vert', 'mais',
      'petit pois', 'poivron', 'radis', 'tomate', 'salade',
    ],
    fruits: [
      'abricot', 'cassis', 'cerise', 'figue', 'fraise', 'framboise',
      'groseille', 'melon', 'myrtille', 'nectarine', 'pasteque', 'peche', 'prune',
    ],
  },
  {
    month: 8,
    legumes: [
      'ail', 'artichaut', 'aubergine', 'blette', 'champignon de paris',
      'concombre', 'courgette', 'fenouil', 'haricot vert', 'mais',
      'poivron', 'tomate', 'salade',
    ],
    fruits: [
      'abricot', 'cassis', 'figue', 'framboise', 'groseille', 'melon',
      'mirabelle', 'mure', 'myrtille', 'nectarine', 'pasteque', 'peche',
      'poire', 'pomme', 'prune',
    ],
  },
  {
    month: 9,
    legumes: [
      'ail', 'artichaut', 'aubergine', 'blette', 'brocoli', 'carotte',
      'chou-fleur', 'champignon de paris', 'concombre', 'courge',
      'courgette', 'cresson', 'epinard', 'fenouil', 'haricot vert', 'mais',
      'oignon', 'poireau', 'poivron', 'potiron', 'tomate', 'salade',
    ],
    fruits: [
      'figue', 'melon', 'mirabelle', 'mure', 'myrtille', 'noisette', 'noix',
      'pasteque', 'peche', 'poire', 'pomme', 'prune', 'raisin',
    ],
  },
  {
    month: 10,
    legumes: [
      'ail', 'betterave', 'blette', 'brocoli', 'carotte', 'celeri',
      'champignon de paris', 'chou', 'chou de bruxelles', 'chou-fleur',
      'concombre', 'courge', 'courgette', 'cresson', 'echalote', 'endive',
      'epinard', 'fenouil', 'haricot vert', 'mache', 'navet', 'oignon',
      'panais', 'poireau', 'potiron', 'salade',
    ],
    fruits: ['chataigne', 'coing', 'figue', 'kaki', 'noisette', 'noix', 'poire', 'pomme', 'raisin'],
  },
  {
    month: 11,
    legumes: [
      'ail', 'betterave', 'brocoli', 'carotte', 'celeri', 'champignon de paris',
      'chou', 'chou de bruxelles', 'chou-fleur', 'courge', 'cresson',
      'echalote', 'endive', 'epinard', 'fenouil', 'mache', 'navet', 'oignon',
      'panais', 'poireau', 'potiron', 'salsifis', 'topinambour',
    ],
    fruits: ['chataigne', 'citron', 'clementine', 'kaki', 'kiwi', 'mandarine', 'noisette', 'poire', 'pomme'],
  },
  {
    month: 12,
    legumes: [
      'ail', 'betterave', 'carotte', 'celeri', 'champignon de paris', 'chou',
      'chou de bruxelles', 'chou-fleur', 'courge', 'cresson', 'echalote',
      'endive', 'epinard', 'mache', 'navet', 'oignon', 'panais', 'poireau',
      'potiron', 'salsifis', 'topinambour',
    ],
    fruits: ['citron', 'clementine', 'kaki', 'kiwi', 'mandarine', 'orange', 'poire', 'pomme'],
  },
];

export const SEASONALITY_MAPPING: SeasonalityMappingEntry[] = MONTHS.flatMap(
  ({ month, legumes, fruits }) => [
    ...legumes.map((name) => ({ month, type: 'legume' as const, name })),
    ...fruits.map((name) => ({ month, type: 'fruit' as const, name })),
  ],
);
