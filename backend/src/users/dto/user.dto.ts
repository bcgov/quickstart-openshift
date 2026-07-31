import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator'

export class UserDto {
  @ApiProperty({
    description: 'The ID of the user',
  })
  @IsInt()
  @IsPositive()
  id!: number

  @ApiProperty({
    description: 'The name of the user',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string

  @ApiProperty({
    description: 'The contact email of the user',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail()
  @MaxLength(200)
  email!: string
}
