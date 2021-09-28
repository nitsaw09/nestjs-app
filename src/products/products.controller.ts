import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductListDto, CreateProductDto, UpdateProductDto } from './dto';

@Controller({
  path: 'product',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('list')
  async getProducts(@Query() query: ProductListDto) {
    try {
      const productList = await this.productsService.getAllProducts(query);
      return productList;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Get(':name')
  async findProduct(@Param('name') name: string) {
    try {
      const product = await this.productsService.getProductDetails(name);
      return product;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Post('create')
  async addProduct(@Body() body: CreateProductDto) {
    try {
      const response: any = {};
      const insertProduct = await this.productsService.createProduct(body);
      response.product = insertProduct;
      response.message = 'Product updated successfully';
      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Put(':name')
  async updateProduct(
    @Param('name') name: string,
    @Body() body: UpdateProductDto,
  ) {
    try {
      const response: any = {};
      const product = await this.productsService.updateProduct(name, body);
      response.product = product;
      response.message = 'Product updated successfully';
      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Delete(':name')
  async deleteProduct(@Param('name') name: string) {
    try {
      const response: any = {};
      await this.productsService.deleteProduct(name);
      response.message = 'Product deleted successfully';
      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
