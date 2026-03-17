import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WritingPrompt, WritingPromptDocument, WritingSubmission, WritingSubmissionDocument } from './schemas/writing.schema';

async function analyzeWithLanguageTool(text: string, minWords: number) {
  try {
    const res = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ text, language: 'en-US', enabledOnly: 'false' }).toString(),
    });
    const data: any = await res.json();
    const errors = data.matches || [];
    const errorCount = errors.length;
    const words = text.trim().split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const grammarScore = Math.max(0, 100 - errorCount * 8);
    const taskScore = words >= minWords ? 100 : Math.round((words / minWords) * 100);
    const avgWordsPerSentence = words / Math.max(sentences, 1);
    const coherenceScore = avgWordsPerSentence >= 5 && avgWordsPerSentence <= 20 ? 90 : 60;
    const overallScore = Math.round((grammarScore + taskScore + coherenceScore) / 3);
    return {
      overallScore, grammarScore, taskScore, coherenceScore,
      errorCount, wordCount: words,
      errors: errors.map((e: any) => ({
        message: e.message,
        context: e.context?.text || '',
        offset: e.offset,
        length: e.length,
        replacements: (e.replacements || []).slice(0, 3).map((r: any) => r.value),
      })),
    };
  } catch {
    return { overallScore: 70, grammarScore: 70, taskScore: 70, coherenceScore: 70, errorCount: 0, wordCount: text.split(/\s+/).length, errors: [] };
  }
}

@Injectable()
export class WritingService {
  constructor(
    @InjectModel(WritingPrompt.name) private promptModel: Model<WritingPromptDocument>,
    @InjectModel(WritingSubmission.name) private submissionModel: Model<WritingSubmissionDocument>,
  ) {}

  async getPrompts(level?: string) {
    const filter: any = {};
    if (level) filter.level = level;
    return this.promptModel.find(filter).lean();
  }

  async getPromptById(id: string) {
    const p = await this.promptModel.findById(id).lean();
    if (!p) throw new NotFoundException('Prompt not found');
    return p;
  }

  async submit(userId: string, promptId: string, text: string) {
    const prompt = await this.promptModel.findById(promptId);
    if (!prompt) throw new NotFoundException('Prompt not found');

    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < prompt.minWords * 0.5)
      throw new BadRequestException(`Text too short (min ${prompt.minWords} words)`);

    const submission = await this.submissionModel.create({
      userId, promptId, text, status: 'pending', submittedAt: new Date(),
    });

    // Analyze async (don't block response)
    analyzeWithLanguageTool(text, prompt.minWords).then(async (analysis) => {
      await this.submissionModel.findByIdAndUpdate(submission._id, { analysis, status: 'analyzed' });
    }).catch(async () => {
      await this.submissionModel.findByIdAndUpdate(submission._id, { status: 'error' });
    });

    return { submissionId: submission._id, status: 'pending' };
  }

  async getSubmission(id: string, userId: string) {
    const s = await this.submissionModel.findOne({ _id: id, userId }).lean();
    if (!s) throw new NotFoundException('Submission not found');
    return s;
  }

  async getSubmissions(userId: string, promptId?: string) {
    const filter: any = { userId };
    if (promptId) filter.promptId = promptId;
    return this.submissionModel.find(filter).sort({ submittedAt: -1 }).populate('promptId').lean();
  }

  async bulkCreatePrompts(prompts: any[]) {
    let inserted = 0, skipped = 0, errors = 0;
    for (const p of prompts) {
      try {
        await this.promptModel.create(p);
        inserted++;
      } catch { errors++; }
    }
    return { inserted, skipped, errors };
  }
}
