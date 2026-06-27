const NO_RAW_FORM =
  'Forme crue/brute absente de CIQUAL pour cet aliment précis ; valeur basée sur la forme cuite la plus neutre disponible.';
const VARIETY_NOT_DISTINGUISHED =
  "CIQUAL ne distingue pas cette variété/coupe précise ; valeur sur l'entrée générique la plus proche.";
const NOT_IN_CIQUAL =
  'Aucune entrée correspondante dans CIQUAL (ingrédient composite ou trop spécifique absent de la table) — à traiter dans un futur lexique dédié.';
const COMPOSITE_NO_MATCH =
  'Produit composite/transformé sans équivalent fiable à 1 entrée dans CIQUAL — nécessite une décomposition en ingrédients de base (ticket futur).';

export interface IngredientAliasSeedEntry {
  alias: string;
  alimCode?: string | null;
  isPantryStaple?: boolean;
  notes?: string;
}

// Source : ADEME, infographie "À chaque mois ses fruits et légumes" (apps/api/seeds/Fruits et légumes mensuels.pdf).
// Noms normalisés (minuscules, sans accents, singulier) pour rester cohérents avec les alias recettes.
export const MONTHS: { month: number; legumes: string[]; fruits: string[] }[] =
  [
    {
      month: 1,
      legumes: [
        'betterave',
        'carotte',
        'celeri',
        'champignon de paris',
        'chou',
        'chou de bruxelles',
        'chou-fleur',
        'courge',
        'cresson',
        'endive',
        'epinard',
        'mache',
        'navet',
        'oignon',
        'panais',
        'poireau',
        'potiron',
        'salsifis',
        'topinambour',
      ],
      fruits: [
        'citron',
        'clementine',
        'kaki',
        'kiwi',
        'mandarine',
        'orange',
        'poire',
        'pomme',
      ],
    },
    {
      month: 2,
      legumes: [
        'betterave',
        'carotte',
        'celeri',
        'champignon de paris',
        'chou',
        'chou de bruxelles',
        'chou-fleur',
        'cresson',
        'endive',
        'epinard',
        'mache',
        'navet',
        'oignon',
        'panais',
        'poireau',
        'salsifis',
        'topinambour',
      ],
      fruits: [
        'citron',
        'clementine',
        'kiwi',
        'mandarine',
        'orange',
        'pamplemousse',
        'poire',
        'pomme',
      ],
    },
    {
      month: 3,
      legumes: [
        'betterave',
        'carotte',
        'celeri',
        'champignon de paris',
        'chou',
        'chou de bruxelles',
        'chou-fleur',
        'cresson',
        'endive',
        'epinard',
        'navet',
        'oignon',
        'panais',
        'poireau',
        'radis',
      ],
      fruits: ['kiwi', 'orange', 'pamplemousse', 'poire', 'pomme'],
    },
    {
      month: 4,
      legumes: [
        'asperge',
        'betterave',
        'champignon de paris',
        'cresson',
        'endive',
        'epinard',
        'fenouil',
        'navet',
        'oignon',
        'poireau',
        'radis',
        'salade',
      ],
      fruits: ['pamplemousse', 'pomme', 'rhubarbe'],
    },
    {
      month: 5,
      legumes: [
        'artichaut',
        'asperge',
        'champignon de paris',
        'concombre',
        'courgette',
        'cresson',
        'epinard',
        'navet',
        'petit pois',
        'radis',
        'salade',
      ],
      fruits: ['fraise', 'pamplemousse', 'rhubarbe'],
    },
    {
      month: 6,
      legumes: [
        'artichaut',
        'asperge',
        'aubergine',
        'blette',
        'champignon de paris',
        'concombre',
        'courgette',
        'fenouil',
        'haricot vert',
        'petit pois',
        'poivron',
        'radis',
        'tomate',
        'salade',
      ],
      fruits: [
        'abricot',
        'cassis',
        'cerise',
        'fraise',
        'framboise',
        'groseille',
        'melon',
        'pamplemousse',
        'pasteque',
        'peche',
        'rhubarbe',
      ],
    },
    {
      month: 7,
      legumes: [
        'ail',
        'artichaut',
        'aubergine',
        'blette',
        'champignon de paris',
        'concombre',
        'courgette',
        'fenouil',
        'haricot vert',
        'mais',
        'petit pois',
        'poivron',
        'radis',
        'tomate',
        'salade',
      ],
      fruits: [
        'abricot',
        'cassis',
        'cerise',
        'figue',
        'fraise',
        'framboise',
        'groseille',
        'melon',
        'myrtille',
        'nectarine',
        'pasteque',
        'peche',
        'prune',
      ],
    },
    {
      month: 8,
      legumes: [
        'ail',
        'artichaut',
        'aubergine',
        'blette',
        'champignon de paris',
        'concombre',
        'courgette',
        'fenouil',
        'haricot vert',
        'mais',
        'poivron',
        'tomate',
        'salade',
      ],
      fruits: [
        'abricot',
        'cassis',
        'figue',
        'framboise',
        'groseille',
        'melon',
        'mirabelle',
        'mure',
        'myrtille',
        'nectarine',
        'pasteque',
        'peche',
        'poire',
        'pomme',
        'prune',
      ],
    },
    {
      month: 9,
      legumes: [
        'ail',
        'artichaut',
        'aubergine',
        'blette',
        'brocoli',
        'carotte',
        'chou-fleur',
        'champignon de paris',
        'concombre',
        'courge',
        'courgette',
        'cresson',
        'epinard',
        'fenouil',
        'haricot vert',
        'mais',
        'oignon',
        'poireau',
        'poivron',
        'potiron',
        'tomate',
        'salade',
      ],
      fruits: [
        'figue',
        'melon',
        'mirabelle',
        'mure',
        'myrtille',
        'noisette',
        'noix',
        'pasteque',
        'peche',
        'poire',
        'pomme',
        'prune',
        'raisin',
      ],
    },
    {
      month: 10,
      legumes: [
        'ail',
        'betterave',
        'blette',
        'brocoli',
        'carotte',
        'celeri',
        'champignon de paris',
        'chou',
        'chou de bruxelles',
        'chou-fleur',
        'concombre',
        'courge',
        'courgette',
        'cresson',
        'echalote',
        'endive',
        'epinard',
        'fenouil',
        'haricot vert',
        'mache',
        'navet',
        'oignon',
        'panais',
        'poireau',
        'potiron',
        'salade',
      ],
      fruits: [
        'chataigne',
        'coing',
        'figue',
        'kaki',
        'noisette',
        'noix',
        'poire',
        'pomme',
        'raisin',
      ],
    },
    {
      month: 11,
      legumes: [
        'ail',
        'betterave',
        'brocoli',
        'carotte',
        'celeri',
        'champignon de paris',
        'chou',
        'chou de bruxelles',
        'chou-fleur',
        'courge',
        'cresson',
        'echalote',
        'endive',
        'epinard',
        'fenouil',
        'mache',
        'navet',
        'oignon',
        'panais',
        'poireau',
        'potiron',
        'salsifis',
        'topinambour',
      ],
      fruits: [
        'chataigne',
        'citron',
        'clementine',
        'kaki',
        'kiwi',
        'mandarine',
        'noisette',
        'poire',
        'pomme',
      ],
    },
    {
      month: 12,
      legumes: [
        'ail',
        'betterave',
        'carotte',
        'celeri',
        'champignon de paris',
        'chou',
        'chou de bruxelles',
        'chou-fleur',
        'courge',
        'cresson',
        'echalote',
        'endive',
        'epinard',
        'mache',
        'navet',
        'oignon',
        'panais',
        'poireau',
        'potiron',
        'salsifis',
        'topinambour',
      ],
      fruits: [
        'citron',
        'clementine',
        'kaki',
        'kiwi',
        'mandarine',
        'orange',
        'poire',
        'pomme',
      ],
    },
  ];

export const INGREDIENT_ALIAS_SEED: IngredientAliasSeedEntry[] = [
  // === Ingrédients du corpus de recettes — mappés vers CIQUAL ===
  { alias: 'ail', alimCode: '11000', isPantryStaple: true },
  {
    alias: 'algues wakame',
    alimCode: '20999',
    notes: 'Seule forme disponible : "Wakamé atlantique, séché ou déshydraté".',
  },
  {
    alias: 'amandes effilees',
    alimCode: '15041',
    notes:
      VARIETY_NOT_DISTINGUISHED +
      ' "Amande, émondée, sans sel ajouté" retenue (forme effilée non isolée).',
  },
  { alias: 'aneth frais', alimCode: '11093' },
  { alias: 'aubergine', alimCode: '20053' },
  { alias: 'banane', alimCode: '13005' },
  { alias: 'basilic frais', alimCode: '11033' },
  { alias: 'beurre', alimCode: '16400' },
  {
    alias: 'blanc de poulet',
    alimCode: '36017',
    notes:
      'CIQUAL distingue désormais le cru ; "Poulet, filet sans peau cru" retenu (amélioration vs CORGIS qui n\'avait que la forme cuite).',
  },
  {
    alias: 'boeuf a braiser',
    alimCode: '6231',
    notes: 'Correspond à "Boeuf, à bourguignon ou pot-au-feu, cru".',
  },
  {
    alias: 'bouillon de legumes',
    alimCode: '11041',
    isPantryStaple: true,
    notes: 'Correspond à "Bouillon de légumes, déshydraté".',
  },
  {
    alias: 'bouquet garni',
    alimCode: null,
    notes:
      NOT_IN_CIQUAL + " (bouquet d'herbes composite : thym, laurier, persil).",
  },
  { alias: 'brocoli', alimCode: '20057' },
  {
    alias: 'cacahuetes concassees',
    alimCode: '15053',
    notes:
      VARIETY_NOT_DISTINGUISHED +
      ' "Cacahuète, grillée, sans sel ajouté" retenue (forme concassée non isolée).',
  },
  { alias: 'cannelle', alimCode: '11025', isPantryStaple: true },
  { alias: 'carotte', alimCode: '20009' },
  { alias: 'champignons de paris', alimCode: '20056' },
  { alias: 'chapelure', alimCode: '7500', isPantryStaple: true },
  { alias: 'cheddar', alimCode: '12726' },
  { alias: 'citron', alimCode: '13009' },
  {
    alias: 'citron vert',
    alimCode: '13067',
    notes:
      'Correspond à "Citron vert ou lime, chair sans peau, sans pépins, cru".',
  },
  { alias: 'concombre', alimCode: '20019' },
  { alias: 'courgette', alimCode: '20020' },
  {
    alias: 'creme fraiche',
    alimCode: '19410',
    notes:
      'CIQUAL a une entrée française directe : "Crème 30% MG, épaisse, rayon frais" (amélioration vs CORGIS qui n\'avait pas de crème fraîche française).',
  },
  {
    alias: 'crevettes decortiquees',
    alimCode: '10021',
    notes:
      'CIQUAL distingue désormais le cru ; "Crevette, crue" retenue (amélioration vs CORGIS). Décortiqué/non décortiqué non distingué.',
  },
  {
    alias: 'cumin moulu',
    alimCode: '11042',
    notes:
      VARIETY_NOT_DISTINGUISHED +
      ' Seule la forme "graine" existe ; pas d\'entrée "poudre" séparée.',
  },
  {
    alias: 'curcuma moulu',
    alimCode: '11089',
    notes: 'Correspond à "Curcuma, poudre".',
  },
  {
    alias: 'curry en poudre',
    alimCode: '11005',
    notes: 'Correspond à "Curry, poudre".',
  },
  { alias: 'eau', alimCode: '18066', notes: 'Correspond à "Eau du robinet".' },
  {
    alias: 'epinards frais',
    alimCode: '20059',
    notes: 'Correspond à "Épinard, cru".',
  },
  {
    alias: 'farine de ble',
    alimCode: '9436',
    isPantryStaple: true,
    notes:
      'Correspond à "Farine de blé tendre ou froment T55 (pour pains)", la plus courante en cuisine.',
  },
  {
    alias: 'feta',
    alimCode: '12066',
    notes:
      'Correspond à "Feta, au lait de brebis 70% minimum et lait de chèvre 30% maximum" (appellation feta stricte).',
  },
  {
    alias: 'filet de cabillaud',
    alimCode: '26043',
    notes:
      'CIQUAL distingue désormais le cru ; "Cabillaud, cru" retenue (amélioration vs CORGIS).',
  },
  { alias: "flocons d'avoine", alimCode: '32140', isPantryStaple: true },
  {
    alias: 'fromage rape',
    alimCode: '12775',
    notes:
      'Correspond à "Mélange de fromages râpés (ex : spécial gratins, spécial pâtes, spécial pizzas…)".',
  },
  {
    alias: 'fruits rouges',
    alimCode: '13997',
    notes:
      'CIQUAL a une entrée directe : "Fruits rouges, crus (framboises, fraises, groseilles, cassis)" (amélioration vs CORGIS qui n\'avait pas ce mélange).',
  },
  {
    alias: 'gingembre frais',
    alimCode: '11074',
    notes:
      'Correspond à "Gingembre, racine fraîche" (amélioration vs CORGIS qui n\'avait que la forme confite/marinée).',
  },
  { alias: 'graines de chia', alimCode: '15047' },
  {
    alias: 'gruyere rape',
    alimCode: '12114',
    notes:
      'Correspond à "Gruyère, sans précision (origine France ou Suisse)" ; forme râpée non isolée nutritionnellement.',
  },
  {
    alias: 'haricots rouges cuits',
    alimCode: '20503',
    notes: 'Correspond à "Haricot rouge, bouilli/cuit à l\'eau".',
  },
  {
    alias: 'herbes de provence',
    alimCode: '11060',
    isPantryStaple: true,
    notes:
      'CIQUAL a une entrée directe : "Herbes de Provence, séchées" (amélioration vs CORGIS qui n\'avait pas ce mélange).',
  },
  {
    alias: "huile d'olive",
    alimCode: '17270',
    isPantryStaple: true,
    notes:
      VARIETY_NOT_DISTINGUISHED +
      ' "Huile d\'olive vierge extra" retenue (seule entrée disponible).',
  },
  {
    alias: 'huile de coco',
    alimCode: '16040',
    notes: 'Correspond à "Huile ou graisse de coco, sans précision".',
  },
  { alias: 'huile de sesame', alimCode: '17400' },
  {
    alias: 'lait',
    alimCode: '19039',
    notes:
      'Correspond à "Lait, sans précision sur la teneur en matière grasse, UHT".',
  },
  {
    alias: "lait d'amande",
    alimCode: '18107',
    notes:
      'Correspond à "Boisson à l\'amande, nature, sans sucres ajoutés, non enrichie, préemballée".',
  },
  { alias: 'lait de coco', alimCode: '18041', isPantryStaple: true },
  {
    alias: 'lardons',
    alimCode: '28501',
    notes: 'Correspond à "Lardon nature, cru".',
  },
  {
    alias: 'lentilles corail',
    alimCode: '20589',
    isPantryStaple: true,
    notes:
      'CIQUAL distingue désormais corail/verte ; "Lentille corail, bouillie/cuite à l\'eau" retenue (amélioration vs CORGIS).',
  },
  {
    alias: 'lentilles vertes',
    alimCode: '20587',
    isPantryStaple: true,
    notes:
      'CIQUAL distingue désormais corail/verte ; "Lentille verte, bouillie/cuite à l\'eau" retenue (amélioration vs CORGIS).',
  },
  {
    alias: 'levure chimique',
    alimCode: '11046',
    isPantryStaple: true,
    notes: 'Correspond à "Levure chimique ou poudre à lever".',
  },
  {
    alias: 'mais',
    alimCode: '20066',
    notes:
      'Correspond à "Maïs doux, appertisé, égoutté" (usage courant en boîte).',
  },
  { alias: 'miel', alimCode: '31008', isPantryStaple: true },
  {
    alias: 'mozzarella',
    alimCode: '19590',
    notes:
      'Correspond à "Mozzarella au lait de vache" (variante standard, distincte de la "di bufala").',
  },
  {
    alias: 'noix de cajou',
    alimCode: '15054',
    notes: 'Correspond à "Noix de cajou, grillée, sans sel ajouté".',
  },
  {
    alias: 'nouilles de riz',
    alimCode: '9900',
    notes: 'Correspond à "Vermicelles de riz sèches, crues".',
  },
  { alias: 'oeuf', alimCode: '22000', notes: 'Correspond à "Oeuf cru".' },
  {
    alias: 'oignon',
    alimCode: '20034',
    isPantryStaple: true,
    notes: 'Correspond à "Oignon, cru".',
  },
  {
    alias: 'oignon nouveau',
    alimCode: '20323',
    notes:
      NO_RAW_FORM +
      ' Seule forme disponible : "Oignon nouveau ou oignon frais ou cébette, sauté/poêlé sans matière grasse".',
  },
  {
    alias: 'oignon rouge',
    alimCode: '20238',
    notes:
      'CIQUAL distingue désormais la couleur ; "Oignon rouge, cru" retenue (amélioration vs CORGIS).',
  },
  {
    alias: 'olives noires',
    alimCode: '13186',
    notes: 'Correspond à "Olive noire (aliment moyen)".',
  },
  {
    alias: 'origan sec',
    alimCode: '11035',
    notes: 'Correspond à "Origan, séché".',
  },
  {
    alias: 'pain a burger',
    alimCode: '7259',
    notes: 'Correspond à "Pain pour burger ou hot dog (bun), préemballé".',
  },
  {
    alias: 'paprika fume',
    alimCode: '11049',
    notes:
      VARIETY_NOT_DISTINGUISHED +
      ' "Paprika, poudre" retenue (variante fumée non isolée).',
  },
  { alias: 'parmesan', alimCode: '12120' },
  {
    alias: 'patate douce',
    alimCode: '4101',
    notes:
      'CIQUAL distingue désormais le cru ; "Patate douce, crue" retenue (amélioration vs CORGIS qui n\'avait que la forme bouillie).',
  },
  {
    alias: 'pate a pizza',
    alimCode: '37001',
    notes:
      'CIQUAL a une entrée directe : "Pâte à pizza, préemballée, crue" (amélioration vs CORGIS qui n\'avait que les pizzas finies).',
  },
  {
    alias: 'pate brisee',
    alimCode: '23410',
    notes:
      'Correspond à "Pâte brisée, matière grasse végétale, préemballée, crue".',
  },
  {
    alias: 'pate de curry rouge',
    alimCode: null,
    notes:
      COMPOSITE_NO_MATCH +
      " (pas d'entrée pâte de curry concentrée dans CIQUAL).",
  },
  { alias: 'pate miso', alimCode: '20916', notes: 'Correspond à "Miso".' },
  {
    alias: 'pave de saumon',
    alimCode: '26036',
    notes: 'Correspond à "Saumon, élevage, cru".',
  },
  { alias: 'persil frais', alimCode: '11014' },
  {
    alias: 'petits pois',
    alimCode: '20072',
    notes: 'Correspond à "Petits pois, crus".',
  },
  {
    alias: 'piment doux',
    alimCode: '20151',
    notes: VARIETY_NOT_DISTINGUISHED + ' "Piment, cru" générique retenue.',
  },
  {
    alias: 'piment en poudre',
    alimCode: '11088',
    notes: 'Correspond à "Poivre de Cayenne ou piment de Cayenne, poudre".',
  },
  {
    alias: 'poireau',
    alimCode: '20039',
    notes: 'Correspond à "Poireau, cru".',
  },
  {
    alias: 'pois chiches cuits',
    alimCode: '20507',
    notes: 'Correspond à "Pois chiche, bouilli/cuit à l\'eau".',
  },
  {
    alias: 'pois chiches secs trempes',
    alimCode: '20507',
    notes:
      'État "trempé puis cuit" non distingué dans CIQUAL ; pois chiche cuit générique retenu, comme pour "pois chiches cuits".',
  },
  {
    alias: 'poivre noir',
    alimCode: '11015',
    isPantryStaple: true,
    notes: 'Correspond à "Poivre noir, poudre".',
  },
  {
    alias: 'poivron',
    alimCode: '20087',
    notes:
      'Couleur non précisée dans la recette ; défaut sur "Poivron rouge, cru".',
  },
  {
    alias: 'poivron rouge',
    alimCode: '20087',
    notes: 'Correspond à "Poivron rouge, cru".',
  },
  {
    alias: 'poivron vert',
    alimCode: '20085',
    notes: 'Correspond à "Poivron vert, cru".',
  },
  {
    alias: 'pomme',
    alimCode: '13039',
    notes: 'Correspond à "Pomme, chair et peau, crue".',
  },
  {
    alias: 'pomme de terre',
    alimCode: '4003',
    notes:
      NO_RAW_FORM + ' Correspond à "Pomme de terre, bouillie/cuite à l\'eau".',
  },
  {
    alias: 'poulet entier',
    alimCode: '36005',
    notes:
      NO_RAW_FORM +
      ' Pas d\'entrée "poulet entier cru" isolée ; "Poulet, viande et peau rôties/cuites au four" (générique, toutes coupes) retenue.',
  },
  {
    alias: 'pousses de soja',
    alimCode: '20183',
    notes:
      'Correspond à "Graine germée de haricot mungo ou pousse de \'soja\', crue".',
  },
  {
    alias: 'quinoa',
    alimCode: '9341',
    isPantryStaple: true,
    notes: 'Cuit, sans sel ajouté.',
  },
  {
    alias: 'riz arborio',
    alimCode: '9104',
    notes:
      VARIETY_NOT_DISTINGUISHED +
      ' "Riz blanc, cuit, sans sel ajouté" générique retenue.',
  },
  {
    alias: 'riz basmati',
    alimCode: '9125',
    notes:
      'CIQUAL a une entrée directe : "Riz basmati, cuit, sans sel ajouté" (amélioration vs CORGIS qui ne distinguait pas la variété).',
  },
  {
    alias: 'riz cuit refroidi',
    alimCode: '9104',
    notes:
      'Refroidissement non distingué dans CIQUAL ; "Riz blanc, cuit, sans sel ajouté" générique retenue.',
  },
  {
    alias: 'salade verte',
    alimCode: '20031',
    notes: 'Correspond à "Laitue, crue".',
  },
  {
    alias: 'sauce soja',
    alimCode: '11104',
    isPantryStaple: true,
    notes: 'Correspond à "Sauce soja, préemballée".',
  },
  {
    alias: 'sauce tomate',
    alimCode: '20260',
    notes:
      'Pas de version "nature" isolée dans CIQUAL (uniquement des sauces tomate composées) ; "Tomate, coulis, appertisé" retenu comme base la plus proche.',
  },
  {
    alias: 'sauce yaourt',
    alimCode: '11166',
    notes: 'Correspond à "Sauce au yaourt, faite maison".',
  },
  {
    alias: 'spaghetti',
    alimCode: '9811',
    notes:
      'Correspond à "Pâtes sèches, standard, cuites, sans sel ajouté" (forme spécifique spaghetti non distinguée).',
  },
  {
    alias: 'sucre',
    alimCode: '31016',
    isPantryStaple: true,
    notes: 'Correspond à "Sucre blanc".',
  },
  {
    alias: 'tahini',
    alimCode: '15203',
    notes: 'Correspond à "Tahin ou purée de sésame".',
  },
  {
    alias: 'thym',
    alimCode: '11038',
    isPantryStaple: true,
    notes: 'Correspond à "Thym, séché".',
  },
  {
    alias: 'tofu ferme',
    alimCode: '20904',
    notes:
      'Correspond à "Tofu nature, préemballé" (bloc ferme standard du marché français).',
  },
  {
    alias: 'tofu soyeux',
    alimCode: '20906',
    notes:
      'CIQUAL distingue désormais ferme/soyeux ; "Tofu soyeux, préemballé" retenue (amélioration vs CORGIS).',
  },
  {
    alias: 'tomate',
    alimCode: '20385',
    notes: 'Correspond à "Tomate sans précision, crue (aliment moyen)".',
  },
  {
    alias: 'tomate concassee',
    alimCode: '20169',
    isPantryStaple: true,
    notes: 'Correspond à "Tomate, chair, appertisée".',
  },
  {
    alias: 'tortilla de ble',
    alimCode: '7815',
    notes: 'Correspond à "Tortilla souple (à garnir), à base de blé".',
  },
  {
    alias: 'vin blanc',
    alimCode: '5215',
    notes: 'Correspond à "Vin blanc sec".',
  },
  { alias: 'vin rouge', alimCode: '5214' },
  {
    alias: 'vinaigre de xeres',
    alimCode: '11018',
    notes:
      VARIETY_NOT_DISTINGUISHED +
      ' Variante "xérès" non distinguée ; "Vinaigre" générique retenue.',
  },
  {
    alias: 'yaourt grec',
    alimCode: '19860',
    notes: 'Correspond à "Yaourt à la grecque nature".',
  },

  // === Ingrédients de fond de placard — non présents dans les recettes ===

  // Féculents & Céréales
  { alias: 'riz blanc', alimCode: '9100', isPantryStaple: true },
  { alias: 'riz complet', alimCode: '9102', isPantryStaple: true },
  {
    alias: 'pates courtes',
    alimCode: '9810',
    isPantryStaple: true,
    notes:
      VARIETY_NOT_DISTINGUISHED + ' "Pâtes sèches, standard, crues" retenues.',
  },
  {
    alias: 'pates longues',
    alimCode: '9810',
    isPantryStaple: true,
    notes:
      VARIETY_NOT_DISTINGUISHED + ' "Pâtes sèches, standard, crues" retenues.',
  },
  {
    alias: 'semoule de ble',
    alimCode: '9610',
    isPantryStaple: true,
    notes: 'Correspond à "Semoule de blé dur, crue".',
  },
  {
    alias: 'boulgour',
    alimCode: '9690',
    isPantryStaple: true,
    notes: 'Correspond à "Boulgour de blé, cru".',
  },
  {
    alias: 'polenta',
    alimCode: '9614',
    isPantryStaple: true,
    notes: 'Correspond à "Polenta ou semoule de maïs, précuite, à cuire".',
  },
  {
    alias: 'pois chiches',
    alimCode: '20516',
    isPantryStaple: true,
    notes: 'Correspond à "Pois chiche, sec".',
  },
  {
    alias: 'haricots rouges',
    alimCode: '20525',
    isPantryStaple: true,
    notes: 'Correspond à "Haricot rouge, sec".',
  },
  {
    alias: 'haricots blancs',
    alimCode: '20501',
    isPantryStaple: true,
    notes: 'Correspond à "Haricot blanc, sec".',
  },
  {
    alias: 'fecule de mais',
    alimCode: '9510',
    isPantryStaple: true,
    notes: 'Correspond à "Amidon de maïs ou fécule de maïs".',
  },

  // Conserves & Liquides de cuisson
  {
    alias: 'coulis de tomates',
    alimCode: '20260',
    isPantryStaple: true,
    notes: 'Correspond à "Tomate, coulis, appertisé".',
  },
  {
    alias: 'concentre de tomate',
    alimCode: '20068',
    isPantryStaple: true,
    notes: 'Correspond à "Tomate, concentré, appertisé".',
  },
  {
    alias: 'thon en conserve',
    alimCode: '26039',
    isPantryStaple: true,
    notes: 'Correspond à "Thon, au naturel, appertisé, égoutté".',
  },
  {
    alias: 'lait uht',
    alimCode: '19039',
    isPantryStaple: true,
    notes:
      'Correspond à "Lait, sans précision sur la teneur en matière grasse, UHT".',
  },
  {
    alias: 'bouillon de volaille',
    alimCode: '11174',
    isPantryStaple: true,
    notes: 'Correspond à "Bouillon de volaille, déshydraté".',
  },

  // Matières Grasses & Condiments
  { alias: 'huile de tournesol', alimCode: '17440', isPantryStaple: true },
  { alias: 'huile de colza', alimCode: '17130', isPantryStaple: true },
  {
    alias: 'vinaigre de vin rouge',
    alimCode: '11220',
    isPantryStaple: true,
    notes: 'Correspond à "Vinaigre de vin rouge".',
  },
  { alias: 'vinaigre de cidre', alimCode: '11090', isPantryStaple: true },
  { alias: 'moutarde', alimCode: '11013', isPantryStaple: true },

  // Épices & Aromates
  {
    alias: 'sel',
    alimCode: '11017',
    isPantryStaple: true,
    notes: 'Correspond à "Sel blanc alimentaire, non iodé, non fluoré".',
  },
  {
    alias: 'cumin',
    alimCode: '11042',
    isPantryStaple: true,
    notes:
      VARIETY_NOT_DISTINGUISHED +
      ' Seule la forme "graine" existe ; pas d\'entrée "poudre" séparée.',
  },
  {
    alias: 'paprika doux',
    alimCode: '11049',
    isPantryStaple: true,
    notes:
      VARIETY_NOT_DISTINGUISHED +
      ' "Paprika, poudre" retenue (variante douce non isolée).',
  },
  {
    alias: 'curcuma',
    alimCode: '11089',
    isPantryStaple: true,
    notes: 'Correspond à "Curcuma, poudre".',
  },
  {
    alias: 'curry',
    alimCode: '11005',
    isPantryStaple: true,
    notes: 'Correspond à "Curry, poudre".',
  },
  {
    alias: 'piment de cayenne',
    alimCode: '11088',
    isPantryStaple: true,
    notes: 'Correspond à "Poivre de Cayenne ou piment de Cayenne, poudre".',
  },
  {
    alias: 'origan',
    alimCode: '11035',
    isPantryStaple: true,
    notes: 'Correspond à "Origan, séché".',
  },

  // Graines & Oléagineux
  {
    alias: 'graines de sesame',
    alimCode: '15010',
    isPantryStaple: true,
    notes: 'Correspond à "Sésame, graine".',
  },
];
