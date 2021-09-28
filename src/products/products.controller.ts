import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ProductsService } from './products.service';
import { ProductListDto, CreateProductDto, UpdateProductDto } from './dto';

@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('list')
  async getProducts(@Query() query: ProductListDto, @Res() res: Response) {
    try {
      const productList = await this.productsService.getAllProducts(query);
      res.status(HttpStatus.OK).json(productList);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Get(':name')
  async findProduct(@Param('name') name: string, @Res() res: Response) {
    try {
      const product = await this.productsService.getProductDetails(name);
      res.status(HttpStatus.OK).json(product);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Post('create')
  async addProduct(@Body() body: CreateProductDto, @Res() res: Response) {
    try {
      const insertProduct = await this.productsService.createProduct(body);
      res.status(HttpStatus.OK).json({
        product: insertProduct,
        message: 'Product created successfully',
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Put(':name')
  async updateProduct(
    @Param('name') name: string,
    @Body() body: UpdateProductDto,
    @Res() res: Response,
  ) {
    try {
      const product = await this.productsService.updateProduct(name, body);
      res
        .status(HttpStatus.OK)
        .json({ product, message: 'Product updated successfully' });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Delete(':name')
  async deleteProduct(@Param('name') name: string, @Res() res: Response) {
    try {
      await this.productsService.deleteProduct(name);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Product deleted successfully' });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
