import { CommandBus, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { createSpyObj } from 'jest-createspyobj';
import { RadioFacade } from './radio.facade';

describe('RadioFacade', () => {
  let service: RadioFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RadioFacade,
        { provide: CommandBus, useValue: createSpyObj(CommandBus) },
        { provide: EventBus, useValue: createSpyObj(EventBus) }
      ]
    }).compile();

    service = module.get<RadioFacade>(RadioFacade);
  });

  test('creates itself', () => {
    expect(service).toBeDefined();
  });
});
