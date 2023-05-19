import { Module } from '@nestjs/common';
import { FileOperationsService } from './file-operations.service';
import { AnimalService } from 'src/animal/animal.service';

@Module({
  providers: [FileOperationsService, AnimalService],
})
export class FileOperationsModule {}
