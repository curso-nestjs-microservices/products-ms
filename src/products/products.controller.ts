import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto';
import { ProductPatterns } from './enums';
import { ValidateProductsDto } from './dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: ProductPatterns.createProduct })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern({ cmd: ProductPatterns.findAllProducts })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: ProductPatterns.findOneProduct })
  findOne(@Payload('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @MessagePattern({ cmd: ProductPatterns.updateProduct })
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }

  @MessagePattern({ cmd: ProductPatterns.deleteProduct })
  remove(@Payload('id') id: string) {
    return this.productsService.softDelete(+id);
  }

  @MessagePattern({ cmd: ProductPatterns.validateProducts })
  validateProducts(@Payload() validateProductsDto: ValidateProductsDto) {
    return this.productsService.validateProducts(validateProductsDto);
  }
}
