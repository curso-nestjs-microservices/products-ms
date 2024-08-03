import { IsDefined, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsDefined()
  @IsPositive()
  @Type(() => Number)
  id: number;
}
