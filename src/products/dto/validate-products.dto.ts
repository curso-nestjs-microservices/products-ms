import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class ValidateProductsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  ids: number[];

  @IsOptional()
  @IsBoolean()
  enabled: boolean;
}
