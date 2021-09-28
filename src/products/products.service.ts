import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Products } from './products.model';
import { Product } from './product.interface';
import { ProductListDto, CreateProductDto, UpdateProductDto } from './dto';
import { sortData } from '../utils';

@Injectable()
export class ProductsService {
  products: Products[] = [];

  async getAllProducts(productEntities: ProductListDto): Promise<Products[]> {
    const { name = '', sortBy = 'name', sortOrder = 'ASC' } = productEntities;
    const products = this.products;
    const sortProducts = await sortData({
      itemList: products,
      field: sortBy,
      order: sortOrder,
    });
    const productList = sortProducts.filter((p: Product) => {
      if (p.name.includes(name)) return p;
    });
    return productList;
  }

  async getProductDetails(name: string): Promise<Product> {
    const product = this.products.find((p: Product) => p.name === name);
    if (product) {
      return product;
    }
    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  }

  async createProduct(product: CreateProductDto): Promise<Product[]> {
    const { name, description, quantity, price } = product;
    const newProduct = new Products(name, description, quantity, price);
    await this.products.push(newProduct);
    return this.products;
  }

  async updateProduct(name: string, data: UpdateProductDto): Promise<Product> {
    const { description, price, quantity } = data;
    const productIndex = this.products.findIndex(
      (p: Product) => p.name === name,
    );
    if (productIndex !== -1) {
      const product = this.products[productIndex];
      product.description = description;
      product.price = price;
      product.quantity = quantity;
      return product;
    } else {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteProduct(name: string): Promise<boolean> {
    const productIndex = this.products.findIndex(
      (p: Product) => p.name === name,
    );
    if (productIndex !== -1) {
      delete this.products[productIndex];
      return true;
    } else {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
  }
}
