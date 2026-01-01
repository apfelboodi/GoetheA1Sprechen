import React, { useState, useEffect } from 'react';
import { part1Prompts } from '../constants';
import RecordingTile from './RecordingTile';
import { GoogleGenAI, Type } from "@google/genai";
import type { RecordingStatus, EvaluationResult } from '../types';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(base64data.substring(base64data.indexOf(',') + 1));
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

type Part1State = {
    status: RecordingStatus;
    result: EvaluationResult | null;
    error: string | null;
};

interface Part1Props {
    onComplete: (score: number) => void;
}

const Part1: React.FC<Part1Props> = ({ onComplete }) => {
  const [introState, setIntroState] = useState<Part1State>({ status: 'idle', result: null, error: null });

  useEffect(() => {
    if (introState.status === 'done' && introState.result) {
        onComplete(introState.result.score);
    }
  }, [introState.status, introState.result, onComplete]);


  const handleRecording = async (blob: Blob, context: string, setState: React.Dispatch<React.SetStateAction<Part1State>>, maxScore: number) => {
    setState({ status: 'evaluating', result: null, error: null });
    
    try {
        const ai = new GoogleGenAI({ apiKey: "AIzaSyCLGxGD0WGgfB7b6S6W9Ec9m38RSh_2Nic" }); // <-- کلید API خود را بین دو علامت " " قرار دهید
        const audioData = await blobToBase64(blob);

        const systemInstruction = `You are an extremely strict, unforgiving, and pedantic Goethe-Zertifikat A1 German language examiner. Your primary task is to evaluate pronunciation with maximum precision, based on the specific context provided.
**Specific Task Context and Pronunciation Rules:**
${context}

**General Evaluation Criteria:**
1.  **Task Adherence:** Does the spoken audio EXACTLY match the task described in the context?
2.  **Pronunciation:** Is the pronunciation clear and phonetically accurate according to the rules in the context?

**CRITICAL INSTRUCTIONS:**
-   **ZERO TOLERANCE for deviation:** If the audio is gibberish or completely unrelated to the task, you MUST assign a score of 0.0.
-   **TRANSCRIPTION IS KEY:** First, transcribe the audio.
-   **PROVIDE CORRECTION:** In a field called 'correctText', provide the ideal, correct German version of what the user should have said.
-   The score MUST be a floating-point number between 0.0 (completely wrong) and 1.0 (perfect), reflecting the user's performance against the specific criteria in the context.
-   Provide brief, direct feedback in **Persian** explaining WHY the score was given.
-   Return ONLY a valid JSON object.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
                parts: [
                    { text: systemInstruction },
                    { inlineData: { mimeType: 'audio/webm', data: audioData } },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        transcription: { type: Type.STRING },
                        score: { type: Type.NUMBER },
                        feedback: { type: Type.STRING },
                        correctText: { type: Type.STRING },
                    },
                    required: ["transcription", "score", "feedback", "correctText"],
                },
            },
        });

        const jsonString = response.text;
        const parsedResult = JSON.parse(jsonString);
        setState({ status: 'done', result: { ...parsedResult, score: parsedResult.score * maxScore }, error: null });

    } catch (e) {
        console.error("Error evaluating response:", e);
        setState({ status: 'error', result: null, error: "Bei der Auswertung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut." });
    }
  };

  const introContext = `The user should introduce themselves covering these topics: ${part1Prompts.join(', ')}. Pronunciation must be clear and phonetically accurate. Pay attention to common A1 errors: umlauts (ä, ö, ü), diphthongs (ei, au, eu), and consonants like 'ch', the German 'r', and 's'. When providing the 'correctText', format it as a full paragraph with each sentence on a new line (using '\\n'), and use digits for numbers (e.g., 'Ich bin 29 Jahre alt').`;
  
  return (
    <section className="p-6 sm:p-8 bg-white rounded-2xl shadow-md">
      <div>
        <div className="text-left mb-8">
          <h2 className="text-3xl font-bold text-slate-700">Teil 1</h2>
          <p className="text-md text-slate-500 mt-2">Sich vorstellen.</p>
          <p className="text-md text-slate-500 mt-1 font-persian text-right" dir="rtl">از کلمات زیر استفاده کن و خودت رو معرفی کن</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6 flex flex-col items-center">
          <ul className="space-y-2">
              {part1Prompts.map((prompt) => (
                  <li key={prompt} className="text-3xl font-sans font-semibold text-slate-700 p-2 text-center">{prompt}</li>
              ))}
          </ul>
        </div>
        <RecordingTile 
          onRecordingComplete={(blob) => handleRecording(blob, introContext, setIntroState, 3)}
          status={introState.status}
          result={introState.result}
          error={introState.error}
          part="Teil 1"
          maxScore={3}
        />
      </div>
    </section>
  );
};

export default Part1;
