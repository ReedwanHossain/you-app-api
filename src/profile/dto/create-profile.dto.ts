import {
  IsString,
  IsDateString,
  IsEnum,
  IsNumber,
  ValidateNested,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

class Horoscope {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  zodiac: string;

  @ApiProperty()
  @IsString()
  period: string;
}

export class CreateProfileDto {
  @ApiProperty()
  @IsString()
  readonly displayName: string;

  @ApiProperty()
  @IsEnum(Gender)
  readonly gender: Gender;

  @ApiProperty()
  @IsDateString()
  readonly birthday: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Horoscope)
  readonly horoscope: Horoscope;

  @ApiProperty()
  @IsNumber()
  readonly height: number;

  @ApiProperty()
  @IsNumber()
  readonly weight: number;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  readonly interests: string[];
}
