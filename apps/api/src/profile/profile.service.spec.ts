import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Household } from './household.entity';
import { HouseholdEquipment } from './household-equipment.entity';
import { HouseholdPantryStaple } from './household-pantry-staple.entity';
import { MemberAllergen } from './member-allergen.entity';
import { MemberExcludedIngredient } from './member-excluded-ingredient.entity';
import { MemberProfile } from './member-profile.entity';
import { ProfileService } from './profile.service';

function fakeMember(overrides: Partial<MemberProfile> = {}): MemberProfile {
  return {
    id: 'member-1',
    householdId: 'household-1',
    household: undefined as never,
    name: 'Papa',
    primaryGoal: 'stabilisation',
    dailyCaloriesTarget: 2200,
    maxSodiumMg: 2300,
    consumptionTrackingEnabled: true,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    allergens: [
      {
        memberId: 'member-1',
        allergen: 'arachide',
        member: undefined as never,
      },
    ],
    excludedIngredients: [
      {
        memberId: 'member-1',
        ingredientName: 'coriandre',
        member: undefined as never,
      },
    ],
    ...overrides,
  };
}

function fakeHousehold(overrides: Partial<Household> = {}): Household {
  return {
    id: 'household-1',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    members: [fakeMember()],
    equipment: [
      {
        householdId: 'household-1',
        equipmentName: 'four',
        household: undefined as never,
      },
    ],
    pantryStaples: [
      {
        householdId: 'household-1',
        ingredientName: 'sel',
        household: undefined as never,
      },
    ],
    ...overrides,
  };
}

describe('ProfileService', () => {
  let service: ProfileService;
  let householdRepository: { find: jest.Mock };
  let memberRepository: { findOne: jest.Mock; delete: jest.Mock };
  let dataSource: { transaction: jest.Mock };
  let manager: {
    create: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    manager = {
      create: jest.fn((_entity, data) => data),
      save: jest.fn(async (entity, data) => {
        if (Array.isArray(data)) return data;
        const id = entity === Household ? 'household-1' : 'member-1';
        return { id, ...data };
      }),
      update: jest.fn(async () => undefined),
      delete: jest.fn(async () => undefined),
    };

    dataSource = {
      transaction: jest.fn(async (callback) => callback(manager)),
    };

    householdRepository = { find: jest.fn() };
    memberRepository = { findOne: jest.fn(), delete: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: DataSource, useValue: dataSource },
        {
          provide: getRepositoryToken(Household),
          useValue: householdRepository,
        },
        {
          provide: getRepositoryToken(MemberProfile),
          useValue: memberRepository,
        },
      ],
    }).compile();

    service = module.get(ProfileService);
  });

  describe('registerHousehold', () => {
    it('creates the household and its members inside a transaction', async () => {
      householdRepository.find
        .mockResolvedValueOnce([]) // singleton existence check
        .mockResolvedValueOnce([fakeHousehold()]); // re-read after creation

      const result = await service.registerHousehold({
        equipment: ['four'],
        pantryStaples: ['sel'],
        members: [
          {
            name: 'Papa',
            primaryGoal: 'stabilisation',
            dailyCaloriesTarget: 2200,
            maxSodiumMg: 2300,
            consumptionTrackingEnabled: true,
            allergens: ['arachide'],
            excludedIngredients: ['coriandre'],
          },
        ],
      });

      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
      expect(manager.save).toHaveBeenCalledWith(Household, {});
      expect(manager.save).toHaveBeenCalledWith(HouseholdEquipment, [
        { householdId: 'household-1', equipmentName: 'four' },
      ]);
      expect(manager.save).toHaveBeenCalledWith(HouseholdPantryStaple, [
        { householdId: 'household-1', ingredientName: 'sel' },
      ]);
      expect(manager.save).toHaveBeenCalledWith(MemberAllergen, [
        { memberId: 'member-1', allergen: 'arachide' },
      ]);
      expect(manager.save).toHaveBeenCalledWith(MemberExcludedIngredient, [
        { memberId: 'member-1', ingredientName: 'coriandre' },
      ]);
      expect(result.id).toBe('household-1');
      expect(result.members).toHaveLength(1);
      expect(result.members[0].allergens).toEqual(['arachide']);
    });

    it('rejects with a conflict when a household is already registered', async () => {
      householdRepository.find.mockResolvedValueOnce([fakeHousehold()]);

      await expect(
        service.registerHousehold({
          equipment: [],
          pantryStaples: [],
          members: [],
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(dataSource.transaction).not.toHaveBeenCalled();
    });
  });

  describe('getHousehold', () => {
    it('throws not found when no household exists yet', async () => {
      householdRepository.find.mockResolvedValueOnce([]);

      await expect(service.getHousehold()).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('addMember', () => {
    it('adds a member to the existing household', async () => {
      householdRepository.find.mockResolvedValueOnce([fakeHousehold()]);
      memberRepository.findOne.mockResolvedValueOnce(fakeMember());

      const result = await service.addMember({
        name: 'Léa',
        primaryGoal: 'sante_cardio',
        dailyCaloriesTarget: 1800,
        maxSodiumMg: 2000,
        consumptionTrackingEnabled: true,
        allergens: [],
        excludedIngredients: [],
      });

      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
      expect(result.id).toBe('member-1');
    });

    it('throws not found when no household has been registered', async () => {
      householdRepository.find.mockResolvedValueOnce([]);

      await expect(
        service.addMember({
          name: 'Léa',
          primaryGoal: 'sante_cardio',
          dailyCaloriesTarget: 1800,
          maxSodiumMg: 2000,
          consumptionTrackingEnabled: true,
          allergens: [],
          excludedIngredients: [],
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(dataSource.transaction).not.toHaveBeenCalled();
    });
  });

  describe('updateMember', () => {
    it('updates fields and replaces allergens/exclusions wholesale', async () => {
      memberRepository.findOne
        .mockResolvedValueOnce(fakeMember()) // existence check
        .mockResolvedValueOnce(
          fakeMember({
            dailyCaloriesTarget: 2000,
            allergens: [
              {
                memberId: 'member-1',
                allergen: 'gluten',
                member: undefined as never,
              },
            ],
          }),
        ); // re-read after update

      const result = await service.updateMember('member-1', {
        dailyCaloriesTarget: 2000,
        allergens: ['gluten'],
      });

      expect(manager.update).toHaveBeenCalledWith(MemberProfile, 'member-1', {
        dailyCaloriesTarget: 2000,
      });
      expect(manager.delete).toHaveBeenCalledWith(MemberAllergen, {
        memberId: 'member-1',
      });
      expect(manager.save).toHaveBeenCalledWith(MemberAllergen, [
        { memberId: 'member-1', allergen: 'gluten' },
      ]);
      expect(manager.delete).not.toHaveBeenCalledWith(
        MemberExcludedIngredient,
        expect.anything(),
      );
      expect(result.allergens).toEqual(['gluten']);
    });

    it('throws not found for an unknown member', async () => {
      memberRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.updateMember('missing', { name: 'X' }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(dataSource.transaction).not.toHaveBeenCalled();
    });
  });

  describe('removeMember', () => {
    it('deletes an existing member', async () => {
      memberRepository.delete.mockResolvedValueOnce({ affected: 1 });

      await expect(service.removeMember('member-1')).resolves.toBeUndefined();
    });

    it('throws not found when the member does not exist', async () => {
      memberRepository.delete.mockResolvedValueOnce({ affected: 0 });

      await expect(service.removeMember('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
