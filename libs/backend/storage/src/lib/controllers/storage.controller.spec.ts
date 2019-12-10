import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueuedTrack } from '@sdj/backend/db';
import { Store } from '@sdj/backend/storage';
import { StorageController } from './storage.controller';

class MockedRepository {}
describe('Storage Controller', () => {
  let controller: StorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Store,
        { provide: getRepositoryToken(QueuedTrack), useClass: MockedRepository }
      ],
      controllers: [StorageController]
    }).compile();

    controller = module.get<StorageController>(StorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
