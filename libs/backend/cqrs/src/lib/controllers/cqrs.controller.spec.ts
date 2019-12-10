import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CqrsController } from './cqrs.controller';

describe('Cqrs Controller', () => {
  let controller: CqrsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [CqrsController]
    }).compile();

    controller = module.get<CqrsController>(CqrsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
