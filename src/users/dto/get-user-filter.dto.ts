import { IsOptional, IsUUID } from 'class-validator';

export class GetUserFilterDto {
  @IsUUID()
  @IsOptional()
  userId: string;
}
