# NOTES

## La répartition de la charge calorique (La chrononutrition)

Le corps ne gère pas les nutriments de la même manière à 7h du matin et à 21h. Un énorme repas le soir perturbe le sommeil et favorise le stockage nocturne.

Ton algorithme doit distribuer le budget calorique calculé selon une courbe logique sur la journée. L'ANSES recommande la répartition classique suivante :

| Repas | Part du budget calorique journalier | Note diététique pour l'algo |
| --- | --- | --- |
| **Petit-déjeuner** | **20% à 25%** | Plutôt riche en lipides et protéines (satiété). |
| **Déjeuner** | **35% à 40%** | Le repas pivot, équilibré (le plus complexe à gérer en restes). |
| **Collation (Optionnelle)** | **10%** | À activer si la fenêtre entre midi et le soir dépasse 6 heures. |
| **Dîner** | **25% à 30%** | Plus léger, pauvre en acides gras saturés pour préserver le sommeil. |

### Les Points de vigilance majeurs

- **La densité nutritionnelle :** Si l'utilisateur a un besoin de $2000\text{ kcal}$ par jour, il doit désormais consommer $1000\text{ kcal}$ par repas. C'est un volume alimentaire important. Ton algorithme doit s'assurer que sur ces deux seuls repas, l'utilisateur atteint **100% de ses RNP en micronutriments (Fibres, Calcium, Fer...)**. Si les portions de légumes et de protéines ne sont pas augmentées en conséquence, l'utilisateur va droit vers les carences.
- **La saturation des protéines :** Le corps ne peut assimiler qu'une quantité limitée de protéines par repas (environ $30\text{g}$ à $45\text{g}$ maximum selon la masse musculaire). Si l'algorithme met $80\text{g}$ de protéines d'un coup dans le déjeuner, une partie sera oxydée et non utilisée pour la synthèse musculaire.

Lors de l'onboarding, poser une question simple sur la structure de la journée : *"Combien de repas faites-vous par jour ?"* avec les options :

1. **3 repas** (Petit-déjeuner, Déjeuner, Dîner)
2. **3 repas + 1 collation** (Idéal pour les sportifs ou les enfants/ados)
3. **2 repas** (Déjeuner, Dîner uniquement)

## Statistiques utilisateur

- Pour chaque repas, calculer le nombre de calories consommées et stocker dans la table `user_consumption`.
- Calculer les quantités de nutriments consommés pour chaque repas et stocker dans la table `user_consumption`.
- Calculer le ratio de nutriments consommés par repas et stocker dans la table `user_consumption` (Protéines, Lipides, Glucides en %).
- Calculer l'index glycémique consommé par repas et stocker dans la table `user_consumption`.
- Afficher les statistiques de consommation sur la page de profil utilisateur.
- Afficher la consommation d'ingrédients sur la page de profil utilisateur.
- Au niveau du foyer, afficher la consommation du garde-manger

## Suivi du poids

- A chaque saisie de poids, par l'utilisateur, persister le changement et affiche un graphique de progression.

## Gestion des protéines

- Le problème : Les protéines végétales (lentilles, céréales) ont souvent un acide aminé limitant (il en manque un pour que la protéine soit parfaitement assimilée) et sont moins bien digérées que les protéines animales (viande, œuf, poisson).

- La règle diététique pour l'algo : Si l'utilisateur a un profil Végétalien ou Végétarien, l'algorithme ne doit pas juste valider le quota de protéines. Il doit appliquer une règle de complémentarité des protéines au sein de la même journée (ou du même repas) en associant obligatoirement : Céréales . Legumineuses.

## Synérgie Fer et Vitamine C

- Le fer et la Vitamine C (Synergie) : Le fer d'origine végétale (épinards, lentilles) est très mal assimilé par le corps ($\approx 5\%$). En revanche, s'il est consommé au cours d'un repas contenant de la Vitamine C (un filet de jus de citron, du persil, des poivrons), son absorption est multipliée par 3.

## Le volume alimentaire et l'indice de satiété

- Deux repas peuvent afficher exactement $600\text{ kcal}$ avec les mêmes macros, mais l'un laissera l'utilisateur affamé tandis que l'autre le rassasiera pour 5 heures.Le volume gastrique : Le cerveau déclenche la satiété (via des mécanorécepteurs) lorsque l'estomac est physiquement distendu.
- La règle pour l'algo : Intègre un Indice de Satiété Potentielle basé sur trois critères de la recette : le poids total de la portion en grammes, le taux de fibres (qui ralentissent la digestion) et le taux de protéines. Si l'utilisateur est en perte de poids (déficit calorique), l'algorithme doit prioriser les recettes à forte densité volumique mais faible densité calorique (ex: remplacer une partie des féculents par des légumes bulbeux ou des courgettes).

## La météo et le climat (Le facteur d'ajustement thermique)

La règle pour l'algo : Lors de l'onboardin, on demande la localisation du foyer. On interroge une API météo pour connaître les tendances des jours du planning.

- En cas de canicule / forte chaleur : Donner un bonus de score aux recettes froides, hydratantes (riches en eau : concombre, pastèque, tomates) et salades.
- En cas de grand froid : Favoriser les plats chauds, réconfortants, les soupes et les mijotés.

## La persistance de la lactase

Plus de 50 % de la population mondiale adulte (et environ 20 % en France) digère mal le lactose à cause de la baisse naturelle de l'enzyme lactase.  L'application doit proposer trois niveaux : Tolérance normale, Sensibilité (limiter le lait fluide mais autoriser les fromages affinés/yaourts sans lactose), et Intolérance stricte (exclusion).

## La balance hydrique

En utilisant la colonne "Eau (g)" de la table CIQUAL, l'application doit calculer le volume d'eau apporté par les repas de la journée. Si une journée est "sèche" (féculents, viandes grillées, biscuits), l'application doit dynamiquement ajuster l'affichage de l'interface utilisateur pour dire : "Aujourd'hui, vos repas sont denses. Pensez à boire 3 verres d'eau supplémentaires ($750\text{ ml}$)."

Puisque ton moteur gère désormais la compensation mathématique lissée (le pool hebdomadaire) et la psychologie comportementale, tu as sécurisé le fonctionnement à moyen terme.

Pour atteindre le niveau d'excellence absolu, il reste **trois derniers facteurs biologiques et chronobiologiques cachés** à intégrer. Ce sont des variables que la majorité des applications ignorent, mais qui font toute la différence sur la balance et la santé métabolique réelle de tes utilisateurs.

## 1. Le NEAT (Non-Exercise Activity Thermogenesis)

- **Le problème métabolique :** Quand un utilisateur entre en déficit calorique (régime), son corps cherche à économiser l'énergie. Sans s'en rendre compte, l'utilisateur va moins bouger spontanément, moins gesticuler : son NEAT s'effondre.
- **La règle pour l'algo :** Connecter l'application aux capteurs de mouvements ou aux podomètres des smartphones :
- Si le nombre de pas quotidiens baisse de plus de 20% sur 3 jours consécutifs, l'algorithme doit anticiper une baisse du NEAT.
- Plutôt que de baisser encore les calories (ce qui affamerait l'utilisateur), l'application doit déclencher un message comportemental orienté NEAT : *"Vos repas restent inchangés, mais pour optimiser votre métabolisme aujourd'hui, tentez de passer 15 minutes debout ou marchez pendant vos appels."*

## 2. Le TEF (Thermic Effect of Food / Effet Thermique des Aliments)

Toutes les calories ne demandent pas le même effort au corps pour être digérées. Digérer consomme de l'énergie, et cette dépense (le TEF) est directement liée au type de macronutriment ingéré.

- **Les protéines ont un TEF de 20% à 30% :** Si l'utilisateur mange $100\text{ kcal}$ de protéines, le corps utilise entre $20$ et $30\text{ kcal}$ uniquement pour les décomposer et les assimiler. Le coût net n'est que de $70\text{ kcal}$.
- **Les glucides ont un TEF de 5% à 15%.**
- **Les lipides ont un TEF de 0% à 3% :** Le gras est stocké ou utilisé presque sans effort digestif.

- **La règle algorithmique avancée :** Lors du calcul du déficit calorique ou de la génération des repas, un repas riche en protéines et en fibres (qui demande aussi un gros effort de digestion) augmente artificiellement la dépense énergétique journalière réelle de l'utilisateur par rapport à un repas liquide (type soupe ou shake) à calories égales. L'application peut utiliser ce paramètre pour optimiser discrètement la perte de poids.

## 3. Le cycle menstruel et ses fluctuations métaboliques

Au cours du cycle féminin (divisé en phase folliculaire et phase lutéale), deux éléments changent radicalement :

- **La dépense énergétique varie :** Durant la **phase lutéale** (les 10 à 14 jours avant les règles), la production de progestérone augmente la température corporelle. Le métabolisme de base augmente naturellement de **2,5% à 5%** (soit environ $+100\text{ kcal}$ à $+200\text{ kcal}$ par jour selon le profil).
- **La résistance à l'insuline et les fringales :** Juste avant les règles, la sensibilité à l'insuline diminue, ce qui crée des envies physiologiques de glucides (sucre, chocolat) et une plus grande propension à stocker le sucre rapide.

Si l'utilisatrice accepte de renseigner son cycle (ou via une connexion à des applications de suivi comme Apple Health ou Clue) :

1. **Phase Folliculaire (Début du cycle) :** Sensibilité maximale à l'insuline. Le corps gère parfaitement les glucides. L'algorithme peut proposer des recettes à IG modéré sans impact négatif.
2. **Phase Lutéale (Fin du cycle) :** Augmenter le budget calorique de $+100$ à $+150\text{ kcal/jour}$ de manière transparente. **Verrouiller les recettes sur un profil strict d'index glycémique très bas et riches en magnésium (cacao pur, oléagineux, légumes verts)**.

En augmentant légèrement les calories avec des aliments à IG bas pendant cette phase, l'algorithme algorithme compense la dépense physique supplémentaire de l'utilisatrice et coupe biologiquement les fringales avant qu'elles n'arrivent. L'utilisatrice ne ressentira pas de frustration.

## Impact des régimes principaux (`DIET_OPTIONS`)

Ces régimes impactent principalement la **biodisponibilité des micronutriments** et la **qualité des protéines**. Ton algorithme doit compenser les nutriments naturellement bas ou absents de ces modes de vie.

| Régime | Impact sur les Macros | Impact critique sur les Micros (Table CIQUAL) | Règle algorithmique cachée |
| --- | --- | --- | --- |
| **Omnivore** | Standard | Aucun (équilibre de base). | Aucune restriction. |
| **Végétarien** | Standard | Alerte sur le **Fer non-héminique** (végétal) et le **Zinc**. | Associer obligatoirement une source de **Vitamine C** aux repas riches en fer pour tripler son absorption. |
| **Végétalien** | Standard | **Vitamine B12** (nulle dans CIQUAL pour le végétal), **Calcium**, **Iode**. | 1. Appliquer la règle de **complémentarité des acides aminés** (Céréales + Légumineuses) à chaque repas. 2. Afficher une note UI : *"Régime végétalien : une supplémentation en B12 est obligatoire."* |
| **Pescétarien** | Standard | **Excellente couverture** en Vitamine D, Iode et Oméga-3. | Plus facile à équilibrer que le végétarisme, car le poisson apporte des protéines complètes à haute biodisponibilité. |
| **Flexitarien** | Standard | Aucun. | Brider les recettes contenant de la viande rouge ou de la charcuterie à **maximum 2 fois par semaine** sur le calendrier hebdomadaire. |

---

## 2. Impact des régimes secondaires (`SECONDARY_DIET_OPTIONS`)

Ces régimes modifient directement **les variables quantitatives** (plafonds de sodium, pourcentages de macros, totaux de fibres) ou agissent comme des filtres d'exclusion d'ingrédients.

### A. Les régimes à visée médicale / santé

- **`reduit_sel` (Hyposodé) :**
- *Modificateur :* Plafonner le Sodium (Na) à **$< 2000\text{ mg/jour}$** ($5\text{g}$ de sel).
- *Action algorithmique :* Donner un bonus aux ingrédients à fort taux de Potassium (K) pour maintenir le ratio $\text{Na}/\text{K} < 1$. Filtrer/pénaliser lourdement les aliments industriels, le fromage, et la charcuterie.

- **`anti_cholesterol` :**
- *Modificateur :* Brider les Acides Gras Saturés (AGS) à **$< 8\%$ de l'apport énergétique total**.
- *Action algorithmique :* Prioriser les acides gras mono-insaturés (huile d'olive) et polyinsaturés (Oméga-3). Augmenter le quota de fibres solubles à un minimum de **$15\text{g/jour}$** (avoine, pommes, légumineuses) pour piéger le cholestérol dans l'intestin.

- **`diabete_ig_bas` :**
- *Modificateur :* Plafonner la **Charge Glycémique (CG) quotidienne à $< 80$**.
- *Action algorithmique :* Exclure les ingrédients ayant un Index Glycémique (IG) supérieur à 55. Forcer la présence de fibres et de protéines à chaque prise alimentaire contenant des glucides pour lisser la réponse insulinique.

- **`pauvre_fodmaps` :**
- *Modificateur :* Filtre d'exclusion strict d'ingrédients.
- *Action algorithmique :* Exclure de la génération de repas tous les aliments riches en oligosaccharides, disaccharides, monosaccharides et polyols fermentescibles (ail, oignon, poireau, blé, artichaut, pommes, lait de vache, édulcorants en "-ol"). *Note : C'est le filtre le plus complexe, il demande une table d'ingrédients mappée avec précision.*

- **`pauvre_fibres` (Sans résidus) :**
- *Modificateur :* Plafonner les Fibres totales à **$< 10\text{g}$ à $15\text{g}$ par jour** (au lieu des $30\text{g}$ recommandés par l'ANSES).
- *Action algorithmique :* Exclure les céréales complètes, les légumineuses, les fruits et légumes crus ou à pépins/peaux dures. Prioriser les produits raffinés (riz blanc, pâtes blanches), les protéines maigres et les légumes très cuits/pelés.

### B. Les régimes de performance ou structurels

- **`cetogene` (Keto) :**
- *Modificateur radical des macros :* **Glucides : 5% à 10%** (maximum $20\text{g}$ à $50\text{g}$ nets) | **Protéines : 15% à 20%** | **Lipides : 70% à 80%**.
- *Action algorithmique :* Supprimer tous les féculents, les fruits (sauf baies en petite quantité) et les sucres. Augmenter massivement les huiles de qualité, les avocats, les œufs, les viandes et poissons gras.

- **`low_carb` :**
- *Modificateur de macros :* **Glucides : 10% à 25%** | **Protéines : 25% à 30%** | **Lipides : 45% à 50%**.
- *Action algorithmique :* Réduire les portions de féculents de moitié et privilégier uniquement les sources de glucides à IG bas riches en fibres. Les protéines augmentent pour maintenir la satiété.

- **`paleo` :**
- *Modificateur :* Filtre d'exclusion par groupe d'aliments.
- *Action algorithmique :* Exclure toutes les céréales (même sans gluten), toutes les légumineuses (lentilles, soja...), tous les produits laitiers et tous les produits transformés (NOVA 3 et 4). Valider les glucides uniquement via les fruits, les racines (patate douce) et les légumes.

### Comment coder les croisements (La matrice d'incompatibilité)

Puisque tu utilises TypeScript, ton application doit être capable de lever une erreur ou de bloquer l'interface si l'utilisateur choisit des options contradictoires.

Par exemple, cocher **`vegetalien`** + **`cetogene`** est un enfer algorithmique et diététique (presque aucun aliment ne coche les deux cases à part l'avocat et l'huile). Idéalelement, crée une règle d'exclusion dans ton formulaire front-end :

```typescript
// Exemple de validation de cohérence des choix de l'utilisateur
function validateDietCombination(primary: string, secondary: string[]): boolean {
  if (primary === 'vegetalien' && secondary.includes('cetogene')) {
    // Risque de deadlock absolu sur la génération de recettes
    return false; 
  }
  if (secondary.includes('cetogene') && secondary.includes('low_carb')) {
    // Redondant et contradictoire
    return false; 
  }
  return true;
}

```

?
