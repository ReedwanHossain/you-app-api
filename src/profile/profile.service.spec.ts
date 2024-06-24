import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfileService } from './profile.service';
import { Gender, Profile } from './schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { NotFoundException } from '@nestjs/common';

const mockProfileModel = {
  new: jest.fn().mockResolvedValue({}),
  constructor: jest.fn().mockResolvedValue({}),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  save: jest.fn(),
  exec: jest.fn(),
};

describe('ProfileService', () => {
  let service: ProfileService;
  let model: Model<Profile>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getModelToken(Profile.name),
          useValue: mockProfileModel,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    model = module.get<Model<Profile>>(getModelToken(Profile.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return a profile if found', async () => {
      const profileId = 'someId';
      const profile = {
        id: profileId,
        displayName: 'Test User',
        gender: Gender.MALE,
        birthday: '1990-01-01',
        horoscope: {
          name: 'Aries',
          zodiac: 'Ram',
          period: 'Mar 21 - Apr 19',
        },
        height: 180,
        weight: 75,
        interests: ['music', 'movies'],
      };
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(profile),
      } as any);

      const result = await service.getProfile(profileId);
      expect(result).toEqual(profile);
      expect(model.findById).toHaveBeenCalledWith(profileId);
    });

    it('should throw NotFoundException if profile not found', async () => {
      const profileId = 'someId';
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.getProfile(profileId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update a profile if found', async () => {
      const profileId = 'someId';
      const updateProfileDto: UpdateProfileDto = {
        displayName: 'Test User',
        gender: Gender.MALE,
        birthday: '1990-01-01',
        horoscope: {
          name: 'Aries',
          zodiac: 'Ram',
          period: 'Mar 21 - Apr 19',
        },
        height: 180,
        weight: 75,
        interests: ['music', 'movies'],
      };
      const updatedProfile = { id: profileId, ...updateProfileDto };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(updatedProfile),
      } as any);

      const result = await service.updateProfile(profileId, updateProfileDto);
      expect(result).toEqual(updatedProfile);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        profileId,
        updateProfileDto,
        { new: true },
      );
    });

    it('should throw NotFoundException if profile not found', async () => {
      const profileId = 'someId';
      const updateProfileDto: UpdateProfileDto = {
        displayName: 'Test User',
        gender: Gender.MALE,
        birthday: '1990-01-01',
        horoscope: {
          name: 'Aries',
          zodiac: 'Ram',
          period: 'Mar 21 - Apr 19',
        },
        height: 180,
        weight: 75,
        interests: ['music', 'movies'],
      };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(
        service.updateProfile(profileId, updateProfileDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
