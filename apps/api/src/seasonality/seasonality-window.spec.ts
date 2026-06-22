import { computeSeasonalityWindow } from './seasonality-window';

describe('computeSeasonalityWindow', () => {
  describe('cas standard (slot dans le mois de départ du lot)', () => {
    it('retourne mois précédent, courant et suivant en milieu d\'année', () => {
      expect(computeSeasonalityWindow(6, 6)).toEqual([5, 6, 7]);
    });

    it('gère le passage à janvier (mois précédent = décembre)', () => {
      expect(computeSeasonalityWindow(1, 1)).toEqual([12, 1, 2]);
    });

    it('gère le passage à décembre (mois suivant = janvier)', () => {
      expect(computeSeasonalityWindow(12, 12)).toEqual([11, 12, 1]);
    });
  });

  describe('cas chevauchement (slot dans un mois différent du mois de départ du lot)', () => {
    it('réduit la fenêtre au mois du créneau et au mois suivant', () => {
      expect(computeSeasonalityWindow(7, 6)).toEqual([7, 8]);
    });

    it('gère le passage à janvier sur la fenêtre réduite', () => {
      expect(computeSeasonalityWindow(1, 12)).toEqual([1, 2]);
    });

    it('applique la même règle réduite même si les mois sont éloignés', () => {
      expect(computeSeasonalityWindow(3, 1)).toEqual([3, 4]);
    });
  });
});
