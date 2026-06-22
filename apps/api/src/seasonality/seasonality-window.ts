function wrapMonth(month: number): number {
  return ((month - 1 + 12) % 12) + 1;
}

/**
 * Cas standard (slot dans le mois de départ du lot) : tolérance mois précédent/suivant.
 * Cas chevauchement (slot dans un mois différent du mois de départ du lot) : fenêtre
 * réduite au mois du créneau et au mois suivant, sans tolérance rétroactive.
 */
export function computeSeasonalityWindow(
  slotMonth: number,
  batchStartMonth: number,
): number[] {
  if (slotMonth === batchStartMonth) {
    return [wrapMonth(slotMonth - 1), slotMonth, wrapMonth(slotMonth + 1)];
  }
  return [slotMonth, wrapMonth(slotMonth + 1)];
}
