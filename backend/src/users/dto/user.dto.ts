import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'The ID of the user',
  })
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  company: string;

  hire_date: Date;

  salary: number;
}
