import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LevelProgress, LevelProgressSchema } from '../progress/schemas/level-progress.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Exercise, ExerciseSchema } from '../exercises/schemas/exercise.schema';
import { MultipleChoice, MultipleChoiceSchema } from '../multiple-choice/schemas/multiple-choice.schema';
import { Reading, ReadingSchema } from '../readings/schemas/reading.schema';
import { Listening, ListeningSchema } from '../listening/schemas/listening.schema';
import { LevelTestService } from './level-test.service';
import { LevelTestController } from './level-test.controller';
import { ProgressModule } from '../progress/progress.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LevelProgress.name, schema: LevelProgressSchema },
      { name: User.name, schema: UserSchema },
      { name: Exercise.name, schema: ExerciseSchema },
      { name: MultipleChoice.name, schema: MultipleChoiceSchema },
      { name: Reading.name, schema: ReadingSchema },
      { name: Listening.name, schema: ListeningSchema },
    ]),
    ProgressModule,
  ],
  controllers: [LevelTestController],
  providers: [LevelTestService],
})
export class LevelTestModule {}
