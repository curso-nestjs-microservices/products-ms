import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto';
import { ProductDB } from './entities/product.entity';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private logger: Logger = new Logger(ProductsService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected!');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll({ page, limit }: PaginationDto) {
    const filter = { enabled: true };
    const total = await this.product.count({ where: filter });
    const totalPages = Math.ceil(total / limit);

    const products: ProductDB[] = [];

    if (page <= totalPages) {
      const productsFound = await this.product.findMany({
        where: filter,
        skip: (page - 1) * limit,
        take: limit,
      });

      products.push(...productsFound);
    }

    return {
      data: products,
      metadata: {
        page: page,
        pagination: limit,
        totalPages: totalPages,
        total: total,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id: id, enabled: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id #${id} was not found`);
    }

    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id, ...data } = updateProductDto;
    await this.findOne(id);

    return this.product.update({
      where: { id: id },
      data: data,
    });
  }

  async softDelete(id: number) {
    await this.findOne(id);

    return this.product.update({
      where: { id: id },
      data: { enabled: false },
    });
  }
}
