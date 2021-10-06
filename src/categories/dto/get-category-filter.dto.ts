import { IsOptional, IsUUID } from 'class-validator';

export class GetCategoryFilterDto {
  @IsUUID()
  @IsOptional()
  categoryId: string;
}
