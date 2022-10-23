import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../users.schema';

// password 의 경우 상속받을 경우 가져오기 때문에 readOnlyData 로
// 만들기 위해서는 PickType을 통해 필요한 것들만 가져올 수 있다.
export class ReadOnlyUserDto extends PickType(User, [
  'email',
  'name',
] as const) {
  @ApiProperty({
    example: '123214125',
    description: 'id',
  })
  id: string;
}
