import { PrismaClient, Product } from '@prisma/client';
import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { CreateProductDto, UpdateProductDto, ValidateProductsDto } from './dto';

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

    const products: Product[] = [];

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
      throw new RpcException({
        message: `Product with id #${id} was not found`,
        status: HttpStatus.BAD_REQUEST,
      });
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

  async validateProducts({ ids, enabled }: ValidateProductsDto) {
    const uniqueIds = [...new Set(ids)];

    const products = await this.product.findMany({
      where: {
        id: {
          in: uniqueIds,
        },
        enabled: enabled,
      },
    });

    if (products.length !== uniqueIds.length) {
      throw new RpcException({
        message: 'Some product were not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }
}
