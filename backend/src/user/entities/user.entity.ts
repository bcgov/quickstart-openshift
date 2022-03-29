import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    example: '1',
    description: 'The ID of the user',
  })
  id: number;

  @ApiProperty({ example: 'Peter Green', description: 'The name of the user' })
  name: string;

  @ApiProperty({
    example: 'reviewer',
    description: 'The type of the user',
  })
  userType: string;
}
