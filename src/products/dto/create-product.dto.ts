import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';
import { Product } from '../entities/product.entity';

export class CreateProductDto extends OmitType(Product, ['id'] as const) {
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
  @Transform(({ value }) => [1, '1', true, 'true'].includes(value))
  enabled: boolean;
}
