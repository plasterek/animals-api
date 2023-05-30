import { Module } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { FileOperationsService } from 'src/animal/file-operations/file-operations.service';

@Module({
  providers: [AnimalService, FileOperationsService],
})
export class AnimalModule {}
