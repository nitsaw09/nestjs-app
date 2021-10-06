import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Products from '../database/entities/products';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  public async createProduct(product: CreateProductDto) {
    try {
      const newProduct = await this.productsRepository.create(product);
      await this.productsRepository.save(newProduct);
      return newProduct;
    } catch (err) {
      this.logger.error(`Create product failed! - ${err.message}`);
      throw new InternalServerErrorException();
    }
  }

  public async getAllProducts() {
    try {
      this.logger.log(`Product list loaded successfully`);
      const products = await this.productsRepository.find();
      return products;
    } catch (err) {
      this.logger.error(`Fail to fetch product list - ${err.message}`);
      throw new InternalServerErrorException();
    }
  }

  public async getProduct(productId: string) {
    const product = await this.productsRepository.findOne(productId);
    if (!product) {
      const errMsg = 'Product not found';
      this.logger.error(`Fail to fetch product ${productId} - ${errMsg}`);
      throw new NotFoundException(errMsg);
    }
    this.logger.log(`Product ${productId} loaded successfully`);
    return product;
  }

  public async updateProduct(productId: string, product: UpdateProductDto) {
    await this.productsRepository.update(productId, product);
    const updatedProduct = await this.productsRepository.findOne(productId);
    if (!updatedProduct) {
      const errMsg = 'Product not found';
      this.logger.error(`Fail to update product ${productId} - ${errMsg}`);
      throw new NotFoundException(errMsg);
    }
    this.logger.log(`Product ${productId} updated successfully`);
    return updatedProduct;
  }

  public async deleteProduct(productId: string) {
    const deleteResponse = await this.productsRepository.softDelete({
      id: productId,
    });
    if (!deleteResponse.affected) {
      const errMsg = 'Product not found';
      this.logger.error(`Fail to delete product ${productId} - ${errMsg}`);
      throw new NotFoundException(errMsg);
    }
    this.logger.log(`Product ${productId} deleted successfully`);
    return deleteResponse;
  }
}
