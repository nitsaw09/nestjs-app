import { IsOptional, IsUUID } from 'class-validator';

export class GetProductFilterDto {
  @IsUUID()
  @IsOptional()
  productId: string;
}
