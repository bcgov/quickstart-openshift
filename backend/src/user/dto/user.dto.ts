import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'The ID of the user',
    // default: '9999',
  })
  id: number;

  @ApiProperty({
    description: 'The name of the user',
    // default: 'username',
  })
  name: string;

  @ApiProperty({
    description: 'The userType of the user, a reviewer or a submitter',
    default: 'submitter',
  })
  userType: string;
}
