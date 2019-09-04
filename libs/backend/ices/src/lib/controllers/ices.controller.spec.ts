import { Test, TestingModule } from '@nestjs/testing';
import { IcesController } from './ices.controller';

describe('Redis Controller', () => {
  let controller: IcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IcesController],
    }).compile();

    controller = module.get<IcesController>(IcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
