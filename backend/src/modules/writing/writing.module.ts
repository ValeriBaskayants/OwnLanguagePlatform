import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WritingPrompt, WritingPromptSchema, WritingSubmission, WritingSubmissionSchema } from './schemas/writing.schema';
import { WritingService } from './writing.service';
import { WritingController } from './writing.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WritingPrompt.name, schema: WritingPromptSchema },
      { name: WritingSubmission.name, schema: WritingSubmissionSchema },
    ]),
  ],
  controllers: [WritingController],
  providers: [WritingService],
  exports: [WritingService],
})
export class WritingModule {}
