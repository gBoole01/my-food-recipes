export interface PantryStapleCiqualEntry {
  name: string;
  alimCode: string | null;
  notes?: string;
}

const COOKED_ONLY =
  'Forme sèche/crue absente de CIQUAL pour cet aliment ; forme cuite retenue.';
const GENERIC =
  'Variante précise absente de CIQUAL ; entrée générique la plus proche retenue.';

export const PANTRY_STAPLES_CIQUAL_MAPPING: PantryStapleCiqualEntry[] = [
  // Féculents & Céréales
  { name: 'Riz blanc', alimCode: '9100' },
  { name: 'Riz complet', alimCode: '9102' },
  {
    name: 'Pâtes courtes',
    alimCode: '9810',
    notes: GENERIC + ' "Pâtes sèches, standard, crues" retenues.',
  },
  {
    name: 'Pâtes longues',
    alimCode: '9810',
    notes: GENERIC + ' "Pâtes sèches, standard, crues" retenues.',
  },
  {
    name: 'Semoule de blé',
    alimCode: '9610',
    notes: 'Correspond à "Semoule de blé dur, crue".',
  },
  {
    name: 'Quinoa',
    alimCode: '9341',
    notes: COOKED_ONLY + ' "Quinoa, bouilli/cuit à l\'eau, sans sel ajouté".',
  },
  {
    name: 'Boulgour',
    alimCode: '9690',
    notes: 'Correspond à "Boulgour de blé, cru".',
  },
  {
    name: 'Polenta',
    alimCode: '9614',
    notes: 'Correspond à "Polenta ou semoule de maïs, précuite, à cuire".',
  },
  { name: "Flocons d'avoine", alimCode: '32140' },
  {
    name: 'Lentilles vertes',
    alimCode: '20587',
    notes: COOKED_ONLY + ' "Lentille verte, bouillie/cuite à l\'eau".',
  },
  {
    name: 'Lentilles corail',
    alimCode: '20589',
    notes: COOKED_ONLY + ' "Lentille corail, bouillie/cuite à l\'eau".',
  },
  {
    name: 'Pois chiches',
    alimCode: '20516',
    notes: 'Correspond à "Pois chiche, sec".',
  },
  {
    name: 'Haricots rouges',
    alimCode: '20525',
    notes: 'Correspond à "Haricot rouge, sec".',
  },
  {
    name: 'Haricots blancs',
    alimCode: '20501',
    notes: 'Correspond à "Haricot blanc, sec".',
  },

  // Farines & Produits de Boulangerie
  {
    name: 'Farine de blé',
    alimCode: '9436',
    notes:
      'Correspond à "Farine de blé tendre ou froment T55 (pour pains)", la plus courante en cuisine.',
  },
  {
    name: 'Fécule de maïs',
    alimCode: '9510',
    notes: 'Correspond à "Amidon de maïs ou fécule de maïs".',
  },
  {
    name: 'Sucre blanc',
    alimCode: '31016',
    notes: 'Correspond à "Sucre blanc".',
  },
  {
    name: 'Levure chimique',
    alimCode: '11046',
    notes: 'Correspond à "Levure chimique ou poudre à lever".',
  },
  { name: 'Chapelure', alimCode: '7500' },

  // Conserves & Liquides de cuisson
  {
    name: 'Coulis de tomates',
    alimCode: '20260',
    notes: 'Correspond à "Tomate, coulis, appertisé".',
  },
  {
    name: 'Tomates concassées',
    alimCode: '20169',
    notes: 'Correspond à "Tomate, chair, appertisée".',
  },
  {
    name: 'Concentré de tomate',
    alimCode: '20068',
    notes: 'Correspond à "Tomate, concentré, appertisé".',
  },
  {
    name: 'Thon en conserve',
    alimCode: '26039',
    notes: 'Correspond à "Thon, au naturel, appertisé, égoutté".',
  },
  {
    name: 'Lait UHT',
    alimCode: '19039',
    notes:
      'Correspond à "Lait, sans précision sur la teneur en matière grasse, UHT".',
  },
  { name: 'Lait de coco', alimCode: '18041' },
  {
    name: 'Bouillon de volaille',
    alimCode: '11174',
    notes: 'Correspond à "Bouillon de volaille, déshydraté".',
  },
  {
    name: 'Bouillon de légumes',
    alimCode: '11041',
    notes: 'Correspond à "Bouillon de légumes, déshydraté".',
  },

  // Matières Grasses, Vinaigres & Condiments
  {
    name: "Huile d'olive",
    alimCode: '17270',
    notes:
      GENERIC + ' "Huile d\'olive vierge extra" retenue (seule entrée disponible).',
  },
  { name: 'Huile de tournesol', alimCode: '17440' },
  { name: 'Huile de colza', alimCode: '17130' },
  {
    name: 'Vinaigre de vin rouge',
    alimCode: '11220',
    notes: 'Correspond à "Vinaigre de vin rouge".',
  },
  { name: 'Vinaigre de cidre', alimCode: '11090' },
  {
    name: 'Sauce soja',
    alimCode: '11104',
    notes: 'Correspond à "Sauce soja, préemballée".',
  },
  { name: 'Moutarde', alimCode: '11013' },

  // Épices, Herbes & Aromates
  {
    name: 'Sel',
    alimCode: '11017',
    notes: 'Correspond à "Sel blanc alimentaire, non iodé, non fluoré".',
  },
  {
    name: 'Poivre noir',
    alimCode: '11015',
    notes: 'Correspond à "Poivre noir, poudre".',
  },
  { name: 'Ail', alimCode: '11000' },
  {
    name: 'Oignons',
    alimCode: '20034',
    notes: 'Correspond à "Oignon, cru".',
  },
  {
    name: 'Cumin',
    alimCode: '11042',
    notes:
      GENERIC + ' Seule la forme "graine" existe ; pas d\'entrée "poudre" séparée.',
  },
  {
    name: 'Paprika doux',
    alimCode: '11049',
    notes: GENERIC + ' "Paprika, poudre" retenu (variante douce non isolée).',
  },
  {
    name: 'Curcuma',
    alimCode: '11089',
    notes: 'Correspond à "Curcuma, poudre".',
  },
  {
    name: 'Curry',
    alimCode: '11005',
    notes: 'Correspond à "Curry, poudre".',
  },
  { name: 'Cannelle', alimCode: '11025' },
  {
    name: 'Piment de Cayenne',
    alimCode: '11088',
    notes: 'Correspond à "Poivre de Cayenne ou piment de Cayenne, poudre".',
  },
  {
    name: 'Herbes de Provence',
    alimCode: '11060',
    notes: 'Correspond à "Herbes de Provence, séchées".',
  },
  {
    name: 'Origan',
    alimCode: '11035',
    notes: 'Correspond à "Origan, séché".',
  },
  { name: 'Thym', alimCode: '11038', notes: 'Correspond à "Thym, séché".' },

  // Graines & Oléagineux
  { name: 'Miel', alimCode: '31008' },
  {
    name: 'Graines de sésame',
    alimCode: '15010',
    notes: 'Correspond à "Sésame, graine".',
  },
];
