import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductFilterDto } from './dto/get-product-filter.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get('list')
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get(':productId')
  getProduct(@Param() getProductParams: GetProductFilterDto) {
    const { productId } = getProductParams;
    return this.productsService.getProduct(productId);
  }

  @Patch(':productId')
  updateProduct(
    @Param() getProductParams: GetProductFilterDto,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const { productId } = getProductParams;
    return this.productsService.updateProduct(productId, updateProductDto);
  }

  @Delete(':productId')
  deleteProduct(@Param() getProductParams: GetProductFilterDto) {
    const { productId } = getProductParams;
    return this.productsService.deleteProduct(productId);
  }
}
