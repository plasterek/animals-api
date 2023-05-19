import { Test, TestingModule } from '@nestjs/testing';
import { FileOperationsService } from '../file-operations.service';

describe('FileOperationsService', () => {
  let service: FileOperationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileOperationsService],
    }).compile();

    service = module.get<FileOperationsService>(FileOperationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
