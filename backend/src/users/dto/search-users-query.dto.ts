import { Type } from 'class-transformer'
import { IsInt, IsJSON, IsOptional, Max, Min } from 'class-validator'

export class SearchUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit = 10

  @IsOptional()
  @IsJSON()
  sort = '[]'

  @IsOptional()
  @IsJSON()
  filter = '[]'
}
