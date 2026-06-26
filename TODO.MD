# Vue d'ensemble du produit

Une web app en français qui collecte :

- les préférences alimentaires de l'utilisateur (régime, allergies, aliments détestés/appréciés) ;
- les appareils et ustensiles de cuisine disponibles ;
- le nombre de convives.

Un système agentique interroge ensuite une base de connaissance interne (corpus de recettes taguées) pour proposer des recettes diététiques adaptées, puis génère une liste de courses consolidée et proportionnée au nombre de personnes.

---

## 🚀 Liste des Épics Techniques (MVP v4.0)

## 📦 ÉPIC 1 : DATA & BACKEND (Normalisation, Algorithmes & Persistance)

*Responsable : Équipe Backend & Data. Stack : Node.js, TypeScript, Postgres (`TypeORM`).*

### [Sprint 1] Phase 0 : Ingestion, Normalisation Métrique & Extension Temporelle

- [X] **EP1.1 [ETL CORGIS & Normalisation] :** Écrire le script d'importation du CSV CORGIS (`apps/api/seeds/CORGIS Food Dataset.csv`) vers la table `food_nutrition` (TypeORM/Postgres). Le jeu de données est déjà exprimé en valeurs absolues pour **100g** (pas de portions américaines floues à convertir) : le travail consiste à parser les ~36 colonnes de nutriments, gérer les cellules vides/non numériques, et mapper vers le schéma `food_nutrition`.
- [X] **EP1.2 [Lexique Ingrédients & Traduction] :** Créer la table `ingredient_aliases` et populer la correspondance sémantique pour mapper les ~100 ingrédients du corpus de recettes français vers les IDs nutritionnels rigoureux de la table `food_nutrition`.
- [X] **EP1.3 [Saisonnalité ADEME Glissante] :** Ingestion des données de saisonnalité ADEME (structure : mois, type, nom). Implémenter la logique de requête de saisonnalité multi-mois :
  - *Cas standard (Lot sur le même mois) :* Récupérer les ingrédients du **mois en cours**, du **mois précédent** et du **mois suivant** pour tolérer les transitions climatiques réelles.
  - *Cas chevauchement (Le planning passe sur un autre mois) :* Réduire la fenêtre stricte au **mois en cours** et au **mois suivant** pour les créneaux basculant sur la nouvelle période.
- [X] **EP1.4 [Seed Recettes] :** Script de peuplement du catalogue initial (30 à 50 recettes complexes). Chaque recette doit contenir ses ingrédients au format métrique pour 1 personne, ses étapes de préparation, ses temps, ses allergènes et ses prérequis matériels durs.

- [X] CIQUAL: Remplacez la classification CORGIS par une classification CIQUAL et revoir les autres entités de la base de données.

### [Sprint 2] Phase 1 : Gestion du Profil, Préférences & Historique Unitaire

- [X] **EP1.5 [API Profile CRUD] :** Implémenté avec un schéma normalisé en **`households` + `member_profiles`** plutôt que le `user_profiles` plat initialement spécifié — un foyer (cuisine partagée) contient plusieurs membres, chacun avec ses propres objectifs/allergies. C'est un écart volontaire par rapport au schéma ci-dessous, conservé pour traçabilité :
  - **Niveau foyer (partagé, ex-tables `user_equipments`/`user_pantry_staples`)** : `households` (singleton applicatif), `household_equipments`, `household_pantry_staples` — le matériel de cuisine et le fond de placard sont partagés par tout le foyer, pas par individu.
  - **Niveau membre (personnel, ex-table `user_profiles` + `user_allergens`/`user_excluded_ingredients`)** : `member_profiles` (id, household_id, name, primary_goal, daily_calories_target, max_sodium_mg, consumption_tracking_enabled, created_at, updated_at), `member_allergens` (member_id, allergen), `member_excluded_ingredients` (member_id, ingredient_name) — les allergies et exclusions sont propres à chaque personne du foyer, ce qu'un schéma à plat `user_id` ne permettait pas de modéliser correctement.
  - Endpoints livrés : `POST /api/profile` (enregistrement initial du foyer + membres), `GET /api/profile`, `POST /api/profile/members`, `PATCH /api/profile/members/:memberId`, `DELETE /api/profile/members/:memberId`. Contrats dans `packages/contracts/src/profile.schema.ts` (`HouseholdSchema`, `MemberProfileSchema`, `HouseholdRegistrationRequestSchema`, `MemberInputSchema`, `MemberUpdateRequestSchema`).
  - **Conséquence pour EP1.6** : les endpoints de patch granulaire doivent suivre ce même découpage foyer/membre plutôt que le `/api/profile/restrictions` plat — `equipment`/`pantry` restent au niveau foyer (singleton, pas d'id), `restrictions` doit être scopé par membre (`/api/profile/members/:memberId/restrictions`), puisque allergènes et exclusions sont personnels.

- [x] **EP1.6 [API Profile Patch] :** Créer les endpoints REST granulaires (`PATCH /api/profile/equipment`, `/api/profile/restrictions`, `/api/profile/pantry`) pour permettre des modifications à la volée du contexte utilisateur sans réinitialiser son profil.
- [X] **EP1.7 [API Feedback Volatile] :** Implémenté en `POST /api/profile/members/:memberId/feedback` plutôt que le `/api/profile/feedback` à plat avec `(user_id, recipe_id)` initialement spécifié — écart volontaire, dans la continuité directe de la correction déjà actée par EP1.6 :
  - Le ticket d'origine référençait un `user_id` qui n'a jamais existé dans le schéma (households/member_profiles depuis EP1.5) ; le vote est personnel à un membre, donc la clé est `(member_id, recipe_id)`.
  - La route est imbriquée sous `/api/profile/members/:memberId/feedback`, suivant la convention déjà établie par `/api/profile/members/:memberId/restrictions` (EP1.6) pour les ressources scopées au membre, plutôt qu'une route plate.
  - La table `recipe_feedbacks` a une clé primaire composite `(member_id, recipe_id)` (même pattern que `member_allergens`/`member_excluded_ingredients`) et une sémantique d'**upsert** : revoter écrase le vote existant, revoter identique est un no-op — pas d'historique append-only.
- [X] **EP1.7Bis [Ajout de régime alimentaire] :** Ajouter un champ `diet` (enum **requis**, défaut `omnivore`) à la table `member_profiles` pour persister le régime alimentaire personnel d'un membre. La table `recipes` disposait déjà de `diet_tags: string[]` côté recettes ; le trou était côté profil. Valeurs : `omnivore | vegetarien | vegetalien | paleo | sans_gluten`. Implémenté en colonne `varchar NOT NULL` (pattern identique à `primary_goal`), sans enum Postgres natif pour faciliter l'ajout futur de valeurs. Contrats Zod mis à jour (`DietSchema`, `MemberInputSchema`, `MemberProfileSchema`) dans `packages/contracts/src/profile.schema.ts`. L'endpoint `PATCH /api/profile/members/:memberId` prend en charge le champ nativement via le spread `...fields` déjà en place dans `updateMember`. UI : sélecteur de chips dans `MemberForm`, tag affiché dans `MemberCard`. Ce champ sera croisé avec `recipes.diet_tags` dans le filtre SQL de EP1.8.

### [Sprint 3] Phase 2 : Moteur de Filtrage Anti-Hallucination & Fallback

- [x] **EP1.8 [SQL Filter & Stratégie Fallback] :** Concevoir le pipeline de nettoyage des recettes. Implémenter l'algorithme de dégradation gracieuse en couches (Cascading Fallback) si le catalogue disponible tombe à **zéro résultat** :

1. *Couche 1 (Dure - Non négociable) :* Élimination stricte des allergènes, aliments exclus de l'onboarding et matériels de cuisson manquants.
2. *Couche 2 (Souple - Niveau 1 de repli) :* Désactivation automatique de l'anti-redondance ingrédients si le catalogue est vide.
3. *Couche 3 (Souple - Niveau 2 de repli) :* Désactivation des filtres `dislike` de l'utilisateur. Envoi d'un drapeau `warning` explicite dans la réponse HTTP.

- [x] **EP1.9 [Anti-Redondance Temporelle et Intra-Batch] :** Développer le vérificateur de variété. Il doit scanner la table `user_planning` (historique stocké par repas individuel) sur les $N$ derniers jours ($N=3$) pour interdire les recettes contenant un ingrédient principal présent plus de $X$ fois ($X=2$). *Note : L'algorithme doit aussi cumuler les ingrédients des recettes déjà acceptées en cours de génération (Cold Start).*

- [x] **EP1.10 [Calculateur Nutritionnel Français] :** Écrire le module de calcul nutritionnel :
  - **Les Macronutriments (Protéines, Lipides, Glucides) :** Ils sont calculés sous forme de **fourchettes de pourcentages** de l'apport énergétique total (les calories calculées précédemment), ou selon le **poids corporel**. **Les Macros se gèrent à la journée**
    - 1g de Protéines = 4 kcal
    - 1g de Glucides = 4 kcal
    - 1g de Lipides = 9 kcal

    - | Macronutriment | Recommandation ANSES | Règle de calcul pour l'algorithme |
      | --- | --- | --- |
      | **Protéines** | **10% à 20%** de l'apport total*(ou minimum $0,83\text{g/kg/j}$ pour un adulte sain)* | **15%** est une excellente moyenne de base. Pour les sportifs (objectif 'gain'), on cible plutôt $1,5\text{g}$ à $2\text{g}$ par kg de poids. |
      | **Lipides** | **35% à 40%** de l'apport total *(Le gras est crucial pour le système hormonal !)* | **35%** (Ne jamais descendre sous 30%, erreur classique des anciennes apps). |
      | **Glucides** | **40% à 55%** de l'apport total | **Le reste des calories (ex: 50%)**. |

  - **Les Micronutriments (Vitamines et Minéraux) :** Ce sont des **valeurs fixes absolues** (en mg ou µg) dépendant uniquement de l'âge, du sexe et de situations spécifiques (grossesse). algorithme n'a pas besoin de faire de calcul dynamique. Tu dois intégrer en base de données une **table de constantes** basée sur le profil de l'utilisateur. **Les Micros peuvent se lisser sur la semaine :**

  | Nutriment | Homme Adulte | Femme Adulte | Cas particuliers (ANSES) |
  | --- | --- | --- | --- |
  | **Fibres** | **30 g / j** | **30 g / j** | Baseline universelle |
  | **Fer** | **11 mg / j** | **16 mg / j** | Femme enceinte : **16-22 mg** |
  | **Calcium** | **950 mg / j** | **950 mg / j** | Jeunes (19-23 ans) : **1000 mg** |
  | **Magnésium** | **380 mg / j** | **300 mg / j** | - |
  | **Vitamine C** | **110 mg / j** | **110 mg / j** | - |

  - Le ratio cible : Le rapport $\text{Oméga-6} / \text{Oméga-3}$ doit être inférieur à 5 (idéalement proche de 4). La population moderne est souvent à plus de 15, ce qui est pro-inflammatoire.La règle algorithmique (Hebdomadaire) : Ton planificateur doit imposer au moins 2 repas par semaine contenant des poissons gras (saumon, sardine, maquereau, hareng) ou une source d'Oméga-3 végétal fort (huile de colza, noix, graines de lin) pour valider le sous-score lipidique.Les acides gras saturés : Limiter l'acide palmitique (viandes grasses, beurre, huile de palme) à moins de 8% de l'apport énergétique total.

  - La charge glycémique globale de la journée : En utilisant l'Index Glycémique (IG) des aliments de tes recettes, calcule la Charge Glycémique de chaque repas :$$\text{CG} = \frac{\text{IG} \times \text{Quantité de glucides nets du repas (g)}}{100}$$
  Le garde-fou : Ton algorithme doit veiller à ce que la somme des CG de la journée ne dépasse pas un score de 120 (CG haute), en privilégiant des repas à CG basse ($\le 10$) ou modérée ($11$ à $19$). C'est crucial pour les profils sédentaires ou en perte de poids pour éviter les fringales.

  - Le ratio sodium / potassium : Ajoute une contrainte où le ratio moléculaire $\text{Sodium} / \text{Potassium}$ doit rester inférieur à 1. Si une recette est riche en sodium (ex: présence de feta, de saumon fumé ou de sauce soja), l'algorithme doit obligatoirement équilibrer le reste de la journée avec des aliments très riches en potassium (avocat, épinards, banane, pommes de terre).
  
- [x] **EP1.11 [Daily Kcal Calculator] :** Écrire un module de calcul du Besoin Énergétique Journalier (BEJ) d'un utilisateur.
  - Il doit collecter le sexe, l'âge, le poids et la taille de l'utilisateur pour connaitre son métabolisme.
  - Il doit collecter des informations sur son activité physique en fonction de son activité quotidienne et ses activités sportives.
  - Cela permettra d'aposer un curseur de besoin énergétique journalier (BEJ) sur le profil utilisateur (Perte de poids, stabilisation, prise de masse).
  - Un badge IMC sera également calculé pour l'utilisateur, qui sera affiché sur le profil.
  - Si l'utilisateur est une femme, il faut également savoir si elle est enceinte ou allaitante.

- [x] Refine Data Model :
  - Establish Core Relational Integrity
   1. Link Ingredients to Nutrition Data **Action:** Update `RecipeIngredient` to include a foreign key pointing to `IngredientAlias`.
   2. Standardize Primary Keys **Action:** Change `Recipe.id` from `varchar` to `uuid` to match every other table in your ecosystem.
      - Normalize the `FoodNutrition` Monolith
    [Optimized Relational Structure]
    FoodCategories Table (Self-referencing tree)
          ▲
          │ (categoryId FK)
    FoodNutrition Table (Pure nutritional values)
   3. Extract Categories into a Hierarchical Tree **Action:** Create a self-referencing `FoodCategory` entity (holding `id`, `name`, `code`, and `parentId`). **Migration Plan:** Drop the 6 group/subgroup columns from `FoodNutrition` and replace them with a single `category_id` foreign key.
   4. Direct Link for Seasonality  **Action:** Remove the loose `Seasonality.name` string property and replace it with a foreign key pointing directly to `FoodNutrition` (or to your new `FoodCategory`).

   5. Implement Performance & Search Optimizations
      - Indexing for Search and Filtering **Action:** Explicitly configure indexes in your TypeORM decorators:
        - Add a **Full-Text Search (FTS) index** or Gin index on `FoodNutrition.nameFr` and `IngredientAlias.alias`.
        - Add standard B-Tree indexes on all foreign keys (`recipe_id`, `food_nutrition_id`, `category_id`).

   6. Enforce Macro-Caching Constraints **Action:** Keep the macro columns (`calories`, `protein`, `carbs`, `fat`) on the `Recipe` entity as a cached state, but implement application-level hooks (`@BeforeInsert()`, `@BeforeUpdate()`) or database triggers.
   7. Feature Expansion (User Exclusions) **Action:** Create a polymorphic or type-safe join table mapped to `userId`. It should store an enum/type (`'ingredient' | 'category' | 'allergen'`) and a `targetValue` string (holding the respective ID or code).

### [Sprint 4] Phase 3 : Génération Batch, Substitution Ciblée & Listes

- [] **EP1.12 [API Batch Generation] :** Créer l'endpoint principal `POST /api/meals/generate`. Il reçoit les métadonnées de l'agenda, applique les filtres SQL, calcule la saisonnalité glissante complexe selon la date cible du lot, et transmet le catalogue qualifié à Gemini.
- [] **EP1.13 [API Single Replacement & Cible Énergétique] :** Développer l'endpoint de remplacement ciblé `POST /api/meals/replace-single`.
- [] **Payload requis :** `recipe_id_rejete`, `date_cible`, `couverts`, `recettes_conservees_ids`, et `target_macros` (les macros exactes du plat rejeté).
- [] **Logique :** L'algorithme isole le créneau, applique la saisonnalité glissante du mois cible, calcule l'anti-redondance (DB + recettes conservées), exclut la recette rejetée et contraint l'IA à piocher une recette respectant le couloir calorique et de sel restant (`target_macros`).

- [] **EP1.14 [API Planning Unitaire Save] :** Implémenter `POST /api/meals/save`. **Règle d'architecture :** Interdiction de faire un `DELETE` global de la semaine passée. Les nouveaux repas sont insérés ligne par ligne avec leur horodatage et leur date cible (`date_repas`), tandis que les anciens repas passent simplement au statut de métrique d'archive pour maintenir la mémoire de l'anti-redondance.
- [] **EP1.15 [API Shopping List Multi-Couverts] :** Concevoir le compilateur de liste de courses. Il somme les ingrédients nets nécessaires au planning actif (en multipliant les ingrédients par le nombre de couverts spécifique à *chaque* créneau de repas), puis soustrait les ingrédients cochés comme disponibles dans le `garde_manger`.

---

## 🎨 ÉPIC 2 : FRONTEND (Interface Déterministe & États Applicatifs)

*Responsable : Équipe Intégration & Client. Stack : React, Vite, Tailwind CSS, Zustand.*

### [Sprint 2] Phase 1 : Wizard d'Onboarding Zéro-Chat

- [] **EP2.1 [UI Wizard Objectifs] :** Créer l'interface de sélection des objectifs nutritionnels sous forme de tuiles graphiques cliquables et exclusives.
- [] **EP2.2 [UI Wizard Exclusions] :** Développer l'input de recherche prédictive branché sur le dictionnaire d'ingrédients pour renseigner les allergies et exclusions absolues.
- [] **EP2.3 [UI Wizard Équipement] :** Concevoir la matrice visuelle des appareils de cuisine avec interrupteurs dynamiques (tous cochés par défaut, l'utilisateur décoche ce qu'il n'a pas chez lui).

### [Sprint 3] Phase 2 : Agenda Temporel Éphémère & Remplacement Visuel

- [] **EP2.4 [UI Agenda Modal UI] :** Développer le panneau de configuration de l'agenda déclenché au clic sur "Génerer mes repas".
- [] **EP2.5 [UI Agenda Temporal Filters] :** Implémenter le calcul automatique basé sur l'heure système de l'utilisateur :
- Si l'application est ouverte après **16h00**, le créneau "Midi" du jour même est automatiquement désactivé et décoché.
- Si l'application est ouverte après **21h30**, l'interface décoche la journée entière en cours et initialise le point d'entrée au lendemain matin.

- [] **EP2.6 [UI Agenda Extension Séquentielle] :** Intégrer le bouton d'incrémentation `[ + Ajouter le jour suivant ]` permettant d'étendre la planification pas à pas de 1 à 7 jours complets, en affichant dynamiquement un sélecteur de couverts par créneau activé.
- [] **EP2.7 [UI Card Preview & Actions] :** Concevoir les cartes de l'écran de prévisualisation temporaire. Afficher le badge vert **"De Saison"** calculé par le backend, les macros recalculées au nombre de couverts du repas, et le bouton **"Remplacer" (icône de régénération)**.
- [] **EP2.8 [UI State Single Loading] :** Gérer l'état de chargement asynchrone localisé à l'échelle d'une seule carte de recette lors de l'appel à `replace-single`, empêchant l'utilisateur de valider le planning global tant que la substitution est en cours.

### [Sprint 4] Phase 3 : Tableau de Bord Persistant & Listes

- [] **EP2.9 [UI Main Dashboard Grid] :** Développer la grille d'accueil de l'application affichant le planning actuellement actif récupéré depuis la base de données.
- [] **EP2.10 [UI Recipe Drawer] :** Concevoir le panneau latéral coulissant (*Drawer*) affichant les détails de préparation d'une recette, sa liste d'ingrédients mise à l'échelle des couverts de ce jour-là, et les boutons rapides de feedback (Like / Dislike).
- [] **EP2.11 [UI Global Warning Toasts] :** Intégrer les notifications d'avertissement visuels lorsque le backend renvoie un flag de dégradation des règles (ex: *"Avis de variété : contraintes assouplies pour ce repas"*).
- [] **EP2.12 [UI Shopping List View] :** Créer l'interface de la liste de courses consolidée, triée par rayon de supermarché, avec items cochables.

---

## 🧠 ÉPIC 3 : PROMPT ENGINEERING & AI (L'Arbitrage Gemini)

*Responsable : Expert IA / Prompt Engineer. Moteur : Gemini 1.5 Pro (Batch) / 1.5 Flash (Remplacement).*

### [Sprint 3 & 4] Directives Cliniques & Contraintes Intra-Batch

- [] **EPA3.1 [JSON Response Schema Strict] :** Structurer et valider les schémas JSON stricts de l'API (`responseSchema`) pour forcer Gemini à répondre sans fioritures textuelles ni structures alternatives, que ce soit pour le planning complet ou la substitution unitaire.
- [] **EPA3.2 [System Prompt Nutrition & Variété Intra-Batch] :** Rédiger la charte de comportement de l'IA (Directives ANSES / PNNS). **Spécification critique :** Injecter la consigne absolue de variété intra-batch pour parer au *Cold Start* : *"Au sein du lot de recettes que tu sélectionnes pour répondre à cette demande précise, tu as l'interdiction stricte de répéter un ingrédient principal plus de 2 fois."*
- [] **EPA3.3 [Contextual Taste & Replacement Tuning] :**
- Configurer l'injection de la liste des titres de recettes aimées de l'utilisateur afin que Gemini s'en serve comme indicateur de profil aromatique préférentiel.
- Pour le prompt de substitution unitaire (exécuté par Gemini Flash), injecter une consigne restrictive forçant l'IA à s'aligner sur la fourchette de macros et de calories transmise par le backend afin de garantir la cohérence métabolique de la journée de l'utilisateur.

---

Voici la spécification technique complète et détaillée de l'**ÉPIC 4 : BACK-OFFICE (Pilotage, Qualité & Data Cleaning)**.

Ce module est conçu pour permettre à vos équipes éditoriales, diététiques et techniques de piloter, tester et enrichir l'application en toute autonomie, sans injection directe de code en base de données.

---

## 🖥️ ÉPIC 4 : BACK-OFFICE ADMIN (Spécifications Détaillées)

*Responsable : Équipe Fullstack / Admin interne. Stack suggérée : React / Tailwind (Frontend Admin) branché sur des endpoints sécurisés du Backend existant.*

### 🥦 Phase 1 : Gestion du Catalogue de Recettes

- [x] **EP4.1 [UI Recettes CRUD & Portionneur Automatique] :**
- *Interface :* Formulaire complet de saisie des fiches recettes (Titre, Instructions étape par étape, Temps de préparation/cuisson, cases à cocher pour les prérequis matériels durs).
- *Logique Backend :* À la saisie des ingrédients, l'administrateur renseigne les quantités pour une table de $X$ personnes (ex: 300g de riz pour 3 personnes). Le système doit diviser automatiquement ces valeurs pour **les stocker rigoureusement à l'échelle d'une portion unitaire (1 personne)**, base requise pour les calculs d'échelle dynamiques de l'application utilisateur (`EP1.4`).

- [] **EP4.2 [Ingress Ingredient Linker] :**
- *Interface :* Outil visuel de correspondance (Mapping). Lors de la saisie d'un ingrédient textuel dans une recette, l'interface propose un champ d'auto-complétion connecté à la table `food_nutrition` (base CORGIS normalisée).
- *Sécurité Data :* Empêche la validation d'une recette si un seul de ses ingrédients n'est pas formellement lié à un ID nutritionnel valide ou s'il manque ses tags d'allergènes.

### ⚙️ Phase 2 : Data Cleaning, Fond de Placard & Saisonnalité

- [] **EP4.3 [Matrice ADEME Dynamique] :**
- *Interface :* Tableau croisé (Ingrédients $\times$ Mois de l'année) sous forme de cases à cocher.
- *Utilité :* Permet de modifier instantanément les mois de haute saisonnalité d'un produit pour ajuster l'algorithme glissant de l'application en cas d'aléa climatique, sans déploiement technique.

- [] **EP4.5 [Pantry Staples Configurator] :**
- *Interface :* Liste des ingrédients globaux avec un interrupteur (Toggle) **"Fond de placard universel"**.
- *Logique :* Tout ingrédient marqué comme tel (ex: sel, poivre, eau, filet d'huile d'olive) est **exclu nativement de la compilation de la liste de courses de l'utilisateur (`EP1.14`)**, allégeant considérablement l'affichage pour l'utilisateur final.

- [] **EP4.6 [Data Cleaning Tool / Merge] :**
- *Interface :* Console de nettoyage des doublons de saisie. Permet de sélectionner plusieurs chaînes de caractères erronées ou variantes orthographiques (ex: *"Tomates cerises"*, *"Tomate cerise"*, *"Petites tomates"*) et de les fusionner (*Merge*).
- *Impact :* Met à jour toutes les recettes existantes vers un alias unique propre afin de garantir l'étanchéité absolue de l'algorithme anti-redondance (`EP1.9`).

### 🧪 Phase 3 : Simulation, Staging & Prompt Ops (Bac à Sable)

- [] **EP4.4 [Sandbox Simulator Profils] :**
- *Interface :* Console de test "Diététicien". Un formulaire permet de configurer un utilisateur virtuel complet (Objectifs, Allergies, Matériel disponible, Mois cible, Historique des repas consommés).
- *Rendu :* En cliquant sur "Simuler", le système affiche :

1. La liste des recettes restantes après le filtre SQL dur.
2. La liste après application du filtre anti-redondance.
3. Le JSON final retourné par Gemini. Une aubaine pour tester la cohérence de l'IA avant la mise en production.

- [] **EP4.7 [Recipe Staging Workflow] :**
- *Logique :* Ajout d'une colonne `status` (`'draft'`, `'test'`, `'published'`) dans la table des recettes.
- *Comportement :* Les administrateurs peuvent modifier ou créer des recettes en mode `'draft'`. Ils peuvent les tester en exclusivité dans le **Sandbox Simulator (EP4.4)**. L'application grand public, elle, ne requête que les recettes au statut `'published'`.

- [] **EP4.8 [Prompt Console & Versioning] :**
- *Interface :* Éditeur de texte sécurisé affichant le *System Prompt* de l'application envoyé à Gemini (`EPA3.2`).
- *Logique :* Permet à l'équipe de modifier les consignes comportementales de l'IA (ex: durcir les critères de restriction du sel selon les nouvelles normes PNNS) et de sauvegarder avec un système de versionnage (`v1.0`, `v1.1`) permettant un *rollback* (retour arrière) instantané si l'IA adopte un comportement anormal.

### 📊 Phase 4 : Monitoring de Qualité Algorithmique

- [] **EP4.10 [Dashboard Fallback Monitor & Analytics Feedbacks] :**
- *Interface :* Graphiques et journaux d'erreurs logiques.
- *Métriques clés :*

1. Alerte sur le taux de déclenchement du **Fallback (EP1.8)** (savoir combien d'utilisateurs se retrouvent avec un catalogue à zéro recette, segmenté par type d'allergie, pour savoir quelles recettes créer en priorité).
2. Top / Flop des recettes basés sur l'accumulation des boutons `Like` / `Dislike` utilisateurs, permettant de retirer automatiquement du catalogue une recette qui ne plaît pas du tout en conditions réelles.

---

## 📌 Matrice des Contrats d'API Clés pour l'Équipe Frontend

Pour garantir l'indépendance des développeurs frontend et backend lors des développements parallèles avec Claude Code, voici la structure exacte des trois structures d'échange majeures :

### 1. Payload de génération globale (`POST /api/meals/generate`)

```json
{
  "user_id": "usr_2026_x92b",
  "agenda_demande": [
    { "date_repas": "2026-06-23", "creneau": "midi", "couverts": 2 },
    { "date_repas": "2026-06-23", "creneau": "soir", "couverts": 4 },
    { "date_repas": "2026-06-24", "creneau": "midi", "couverts": 2 }
  ]
}

```

### 2. Payload de remplacement unitaire (`POST /api/meals/replace-single`)

```json
{
  "user_id": "usr_2026_x92b",
  "creneau_a_remplacer": {
    "date_repas": "2026-06-23",
    "creneau": "soir",
    "couverts": 4,
    "recipe_id_rejete": "rec_chicken_curry_01"
  },
  "target_macros": {
    "calories": 520,
    "sel_g": 0.8
  },
  "recettes_conservees_ids": [
    "rec_salmon_salad_09",
    "rec_pasta_pesto_14"
  ]
}

```

### 3. Payload de sauvegarde en base de données (`POST /api/meals/save`)

```json
{
  "user_id": "usr_2026_x92b",
  "planning_final": [
    { "date_repas": "2026-06-23", "creneau": "midi", "recipe_id": "rec_salmon_salad_09", "couverts": 2 },
    { "date_repas": "2026-06-23", "creneau": "soir", "recipe_id": "rec_veggie_wok_88", "couverts": 4 },
    { "date_repas": "2026-06-24", "creneau": "midi", "recipe_id": "rec_pasta_pesto_14", "couverts": 2 }
  ]
}

```

---

## NOTES

### La répartition de la charge calorique (La chrononutrition)

Le corps ne gère pas les nutriments de la même manière à 7h du matin et à 21h. Un énorme repas le soir perturbe le sommeil et favorise le stockage nocturne.

Ton algorithme doit distribuer le budget calorique calculé selon une courbe logique sur la journée. L'ANSES recommande la répartition classique suivante :

| Repas | Part du budget calorique journalier | Note diététique pour l'algo |
| --- | --- | --- |
| **Petit-déjeuner** | **20% à 25%** | Plutôt riche en lipides et protéines (satiété). |
| **Déjeuner** | **35% à 40%** | Le repas pivot, équilibré (le plus complexe à gérer en restes). |
| **Collation (Optionnelle)** | **10%** | À activer si la fenêtre entre midi et le soir dépasse 6 heures. |
| **Dîner** | **25% à 30%** | Plus léger, pauvre en acides gras saturés pour préserver le sommeil. |
