import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileOperationsModule } from './file-operations/file-operations.module';
import { FileOperationsService } from './file-operations/file-operations.service';
import { AnimalService } from './animal/animal.service';
import { AnimalModule } from './animal/animal.module';

@Module({
  imports: [FileOperationsModule, AnimalModule],
  controllers: [AppController],
  providers: [AppService, FileOperationsService, AnimalService],
})
export class AppModule {}
