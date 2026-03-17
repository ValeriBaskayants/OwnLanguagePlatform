import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthModule } from './modules/auth/auth.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { GrammarRulesModule } from './modules/grammar-rules/grammar-rules.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { ReadingsModule } from './modules/readings/readings.module';
import { MultipleChoiceModule } from './modules/multiple-choice/multiple-choice.module';
import { ListeningModule } from './modules/listening/listening.module';
import { WritingModule } from './modules/writing/writing.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { MistakesModule } from './modules/mistakes/mistakes.module';
import { ProgressModule } from './modules/progress/progress.module';
import { LevelTestModule } from './modules/level-test/level-test.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { AdminModule } from './modules/admin/admin.module';
import { DailyActivityModule } from './modules/daily-activity/daily-activity.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongoUri'),
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [{
          ttl: (config.get<number>('throttleTtl') ?? 60) * 1000,
          limit: config.get<number>('throttleLimit') ?? 120,
        }],
      }),
    }),
    AuthModule,
    ExercisesModule,
    GrammarRulesModule,
    VocabularyModule,
    ReadingsModule,
    MultipleChoiceModule,
    ListeningModule,
    WritingModule,
    SessionsModule,
    MistakesModule,
    ProgressModule,
    LevelTestModule,
    BookmarksModule,
    AdminModule,
    DailyActivityModule,
  ],
})
export class AppModule {}