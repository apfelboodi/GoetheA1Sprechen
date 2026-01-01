import type React from 'react';

export interface Part2Card {
    word: string;
    imageUrl: string;
    exampleQuestion: string;
    theme?: string;
}

export interface Part3Card {
    title: string;
    imageUrl: string;
    exampleRequest: string;
    exampleResponse: string;
}

export type RecordingStatus = 'idle' | 'recording' | 'stopped' | 'evaluating' | 'done' | 'error';

export interface EvaluationResult {
    transcription: string;
    score: number;
    feedback: string;
    aiResponse?: string;
    correctText?: string;
    alternativeSentence?: string;
}