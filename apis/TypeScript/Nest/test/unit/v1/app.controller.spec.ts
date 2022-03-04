import { Test, TestingModule } from '@nestjs/testing';
import { AppControllerV1 } from '../../../src/v1/controllers/app.controller';
import { AppService } from '../../../src/v1/service/app.service';
import { User } from '../../../src/v1/entities/user.entity';
describe('AppController', () => {
  let app: TestingModule;
  let controller: AppControllerV1;
  let service: AppService;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppControllerV1],
      providers: [
        AppService,
        {
          provide: AppService,
          useValue: {
            AppService: jest
              .fn()
              .mockImplementation((user: User) =>
                Promise.resolve({ id: '1', ...user }),
              ),
            findAll: jest.fn().mockResolvedValue([
              {
                firstName: 'firstName #1',
                lastName: 'lastName #1',
              },
              {
                firstName: 'firstName #2',
                lastName: 'lastName #2',
              },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                firstName: 'firstName #1',
                lastName: 'lastName #1',
                userId: id,
              }),
            ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = app.get<AppControllerV1>(AppControllerV1);
    service = app.get<AppService>(AppService);
  });

  describe('findOne', () => {
    it('should find a user', () => {
      expect(controller.getUserByID('1')).resolves.toEqual({
        firstName: 'firstName #1',
        lastName: 'lastName #1',
        userId: '1',
      });
      expect(service.findOne).toHaveBeenCalled();
    });
  });
});
