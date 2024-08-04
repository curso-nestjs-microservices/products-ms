import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Product } from '@prisma/client';

export class CreateProductDto
  implements Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
{
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsNumber({
    maxDecimalPlaces: 4,
  })
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => [1, '1', true, 'true'].includes(value))
  enabled: boolean;
}
