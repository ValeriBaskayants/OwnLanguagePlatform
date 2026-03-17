import { Model } from 'mongoose';
import { UserDocument } from '../auth/schemas/user.schema';
import { ExercisesService } from '../exercises/exercises.service';
import { GrammarRulesService } from '../grammar-rules/grammar-rules.service';
import { VocabularyService } from '../vocabulary/vocabulary.service';
import { ReadingsService } from '../readings/readings.service';
import { MultipleChoiceService } from '../multiple-choice/multiple-choice.service';
import { WritingService } from '../writing/writing.service';
import { ListeningService } from '../listening/listening.service';
export declare class AdminService {
    private userModel;
    private exercisesService;
    private grammarRulesService;
    private vocabularyService;
    private readingsService;
    private mcService;
    private writingService;
    private listeningService;
    constructor(userModel: Model<UserDocument>, exercisesService: ExercisesService, grammarRulesService: GrammarRulesService, vocabularyService: VocabularyService, readingsService: ReadingsService, mcService: MultipleChoiceService, writingService: WritingService, listeningService: ListeningService);
    importExercises(data: any): unknown;
    importGrammarRules(data: any): unknown;
    importVocabulary(data: any): unknown;
    importReadings(data: any): unknown;
    importMultipleChoice(data: any): unknown;
    importWritingPrompts(data: any): unknown;
    importListening(data: any): unknown;
    getStats(): unknown;
}
