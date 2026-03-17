import { Model } from 'mongoose';
import { LevelProgressDocument } from '../progress/schemas/level-progress.schema';
import { UserDocument } from '../auth/schemas/user.schema';
import { ExerciseDocument } from '../exercises/schemas/exercise.schema';
import { MultipleChoiceDocument } from '../multiple-choice/schemas/multiple-choice.schema';
import { ReadingDocument } from '../readings/schemas/reading.schema';
import { ListeningDocument } from '../listening/schemas/listening.schema';
import { ProgressService } from '../progress/progress.service';
export declare class LevelTestService {
    private progressModel;
    private userModel;
    private exerciseModel;
    private mcModel;
    private readingModel;
    private listeningModel;
    private progressService;
    constructor(progressModel: Model<LevelProgressDocument>, userModel: Model<UserDocument>, exerciseModel: Model<ExerciseDocument>, mcModel: Model<MultipleChoiceDocument>, readingModel: Model<ReadingDocument>, listeningModel: Model<ListeningDocument>, progressService: ProgressService);
    getQuestions(userId: string): unknown;
    submitTest(userId: string, body: {
        answers: Array<{
            sectionType: string;
            itemId: string;
            userAnswer: string;
            correctAnswer: string;
            isCorrect: boolean;
        }>;
        startedAt: string;
    }): unknown;
}
