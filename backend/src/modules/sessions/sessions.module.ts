import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './schemas/session.schema';
import { Mistake, MistakeSchema } from '../mistakes/schemas/mistake.schema';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { ProgressModule } from '../progress/progress.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: Mistake.name, schema: MistakeSchema },
    ]),
    ProgressModule,
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
