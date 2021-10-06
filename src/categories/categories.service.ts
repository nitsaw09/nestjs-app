import {
  Logger,
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Categories from '../database/entities/categories';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  public async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name: categoryName } = createCategoryDto;

    const categoryExist = await this.categoriesRepository.find({
      where: { name: categoryName },
    });

    if (categoryExist.length) {
      const errMsg = 'Category already exits!';
      this.logger.error(`Create category failed! - ${errMsg}`);
      throw new BadRequestException(errMsg);
    }

    try {
      const newCategory = await this.categoriesRepository.create(
        createCategoryDto,
      );
      await this.categoriesRepository.save(newCategory);
      this.logger.log(`Category created successfully`);
      return newCategory;
    } catch (err) {
      this.logger.error(`Create category failed! - ${err.message}`);
      throw new InternalServerErrorException();
    }
  }

  public async getAllCategories() {
    try {
      this.logger.log(`Category list loaded successfully`);
      const categories = await this.categoriesRepository.find();
      return categories;
    } catch (err) {
      this.logger.error(`Fail to fetch category list - ${err.message}`);
      throw new InternalServerErrorException();
    }
  }

  public async getCategory(categoryId: string) {
    const category = await this.categoriesRepository.findOne(categoryId);
    if (!category) {
      const errMsg = 'Category not found';
      this.logger.error(`Fail to fetch category ${categoryId} - ${errMsg}`);
      throw new NotFoundException(errMsg);
    }
    this.logger.log(`Category ${categoryId} loaded successfully`);
    return category;
  }

  public async updateCategory(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.categoriesRepository.update(categoryId, updateCategoryDto);
    const updatedCategory = await this.categoriesRepository.findOne(categoryId);
    if (!updatedCategory) {
      const errMsg = 'Category not found';
      this.logger.error(`Fail to update category ${categoryId} - ${errMsg}`);
      throw new NotFoundException(errMsg);
    }
    this.logger.log(`Category ${categoryId} updated successfully`);
    return updatedCategory;
  }

  public async deleteCategory(categoryId: string) {
    const deleteResponse = await this.categoriesRepository.softDelete({
      id: categoryId,
    });
    if (!deleteResponse.affected) {
      const errMsg = 'Category not found';
      this.logger.error(`Fail to update category ${categoryId} - ${errMsg}`);
      throw new NotFoundException(errMsg);
    }
    this.logger.log(`Category ${categoryId} deleted successfully`);
    return deleteResponse;
  }
}
