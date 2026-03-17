import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Listening, ListeningSchema } from './schemas/listening.schema';
import { ListeningService } from './listening.service';
import { ListeningController } from './listening.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Listening.name, schema: ListeningSchema }])],
  controllers: [ListeningController],
  providers: [ListeningService],
  exports: [ListeningService],
})
export class ListeningModule {}
