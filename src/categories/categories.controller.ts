import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryFilterDto } from './dto/get-category-filter.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get('list')
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':categoryId')
  getCategory(@Param() getCategoryParams: GetCategoryFilterDto) {
    const { categoryId } = getCategoryParams;
    return this.categoriesService.getCategory(categoryId);
  }

  @Patch(':categoryId')
  updateCategory(
    @Param() getCategoryParams: GetCategoryFilterDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const { categoryId } = getCategoryParams;
    return this.categoriesService.updateCategory(categoryId, updateCategoryDto);
  }

  @Delete(':categoryId')
  deleteCategory(@Param() getCategoryParams: GetCategoryFilterDto) {
    const { categoryId } = getCategoryParams;
    return this.categoriesService.deleteCategory(categoryId);
  }
}
