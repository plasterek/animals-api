import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileOperationsService } from './animal/file-operations/file-operations.service';
import { AnimalService } from './animal/animal.service';
import { AnimalModule } from './animal/animal.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AnimalModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, FileOperationsService, AnimalService],
})
export class AppModule {}
