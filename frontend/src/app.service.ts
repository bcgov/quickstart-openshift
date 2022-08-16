import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello (): string {
    return 'Hello Frontend Modification #1!'
  }
}
