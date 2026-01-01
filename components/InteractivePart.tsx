import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { RecordingStatus, EvaluationResult } from '../types';
import RecordingTile from './RecordingTile';
import AiMessage from './AiMessage';

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

type TurnState = 'SELECT_CARD' | 'USER_ACTION' | 'EVALUATING_USER_ACTION' | 'AI_ACTION' | 'USER_RESPONSE' | 'EVALUATING_USER_RESPONSE' | 'ROUND_COMPLETE';

interface InteractivePartProps {
  partName: string;
  instruction: string;
  instructionPersian?: string;
  cards: any[];
  userActionText: string;
  userActionTextPersian?: React.ReactNode;
  aiActionText: string;
  getAiResponsePrompt: (transcription: string) => string;
  getAiQuestionPrompt: (card: any) => string;
  renderCardContent: (card: any) => React.ReactNode;
  maxScore: number;
  onComplete: (score: number) => void;
  isFinalPart?: boolean;
}

const InteractivePart: React.FC<InteractivePartProps> = (props) => {
    const { partName, instruction, instructionPersian, cards, userActionText, userActionTextPersian, aiActionText, getAiResponsePrompt, getAiQuestionPrompt, renderCardContent, maxScore, onComplete, isFinalPart = false } = props;

    const [turn, setTurn] = useState<TurnState>('SELECT_CARD');
    const [status, setStatus] = useState<RecordingStatus>('idle');
    const [userCard, setUserCard] = useState<any | null>(null);
    const [aiCard, setAiCard] = useState<any | null>(null);
    const [userEval, setUserEval] = useState<EvaluationResult | null>(null);
    const [responseEval, setResponseEval] = useState<EvaluationResult | null>(null);
    const [aiMessage, setAiMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [shouldAutoplay, setShouldAutoplay] = useState(false);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [totalPartScore, setTotalPartScore] = useState(0);

    const availableAiCards = useMemo(() => cards.filter(c => c.id !== userCard?.id), [cards, userCard]);

    const handleApiCall = async (systemInstruction: string, audioBlob: Blob | null, hasJsonResponse: boolean): Promise<any> => {
        // FIX: Use process.env.API_KEY instead of import.meta.env.VITE_API_KEY
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const contents = audioBlob 
            ? { parts: [{ text: systemInstruction }, { inlineData: { mimeType: 'audio/webm', data: await blobToBase64(audioBlob) } }] }
            : systemInstruction;

        const config = hasJsonResponse ? {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    transcription: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    feedback: { type: Type.STRING },
                    aiResponse: { type: Type.STRING, description: "The AI's conversational response." },
                    correctText: { type: Type.STRING },
                    alternativeSentence: { type: Type.STRING, description: "Provide one alternative, different but correct, German sentence the user could have used." },
                },
                required: ["transcription", "score", "feedback", "correctText"],
            },
        } : {};

        try {
            const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents, config });
            const text = response.text;
            return hasJsonResponse ? JSON.parse(text) : text;
        } catch (e) {
            console.error("API Error:", e);
            setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
            setStatus('error');
            setTurn('SELECT_CARD'); // Reset on error
            return null;
        }
    };
    
    const handleSelectCard = (card: any) => {
        setUserCard(card);
        setUserEval(null);
        setResponseEval(null);
        setAiMessage(null);
        setAiCard(null);
        setError(null);
        setStatus('idle');
        setShouldAutoplay(false);
        setTurn('USER_ACTION');
    };

    const handleChangeCard = () => {
        setUserCard(null);
        setTurn('SELECT_CARD');
    }

    const handleUserActionRecording = async (blob: Blob) => {
        setStatus('evaluating');
        setTurn('EVALUATING_USER_ACTION');
        const systemInstruction = `You are a strict Goethe-Zertifikat A1 German language examiner. The user's task is: "${userActionText}". Evaluate their spoken German.
**CRITICAL INSTRUCTIONS:**
- Provide a score from 0.0 to 1.0.
- Provide brief feedback in **Persian**.
- In 'correctText', provide the ideal, grammatically correct German version.
- The response in 'aiResponse' MUST be a simple, natural, A1-level German sentence. It MUST be spoken VERY slowly and clearly, as if for an absolute A1 beginner.
- In 'alternativeSentence', provide a DIFFERENT but correct alternative sentence the user could have said.
- Return ONLY a valid JSON object.`;
        const result: EvaluationResult | null = await handleApiCall(systemInstruction, blob, true);
        if (result) {
            setUserEval({...result, score: result.score * (maxScore / 2)});
            setStatus('done');
            setTurn('AI_ACTION');
        }
    };
    
    const handleAiTurn = async () => {
        setIsAiThinking(true);
        setAiMessage(null); // Prevents flash of old content
        const pickedCard = availableAiCards[Math.floor(Math.random() * availableAiCards.length)];
        setAiCard(pickedCard);
        
        const prompt = getAiQuestionPrompt(pickedCard);
        const aiQuestion = await handleApiCall(prompt, null, false);
        if(aiQuestion) {
            setAiMessage(aiQuestion);
            setStatus('idle');
            setShouldAutoplay(true);
            setTurn('USER_RESPONSE');
        }
        setIsAiThinking(false);
    };
    
    const handleUserResponseRecording = async (blob: Blob) => {
        setStatus('evaluating');
        setTurn('EVALUATING_USER_RESPONSE');
        const systemInstruction = `You are a strict Goethe-Zertifikat A1 German language examiner. The AI asked: "${aiMessage}". Evaluate the user's spoken answer.
**CRITICAL INSTRUCTIONS:**
- Provide a score from 0.0 to 1.0.
- Provide brief feedback in **Persian**.
- In 'correctText', provide the ideal, grammatically correct German answer.
- In 'alternativeSentence', provide a DIFFERENT but correct alternative sentence the user could have said.
- Return ONLY a valid JSON object.`;
        const result: EvaluationResult | null = await handleApiCall(systemInstruction, blob, true);
        if(result && userEval) {
            const currentResponseEval = {...result, score: result.score * (maxScore / 2)};
            setResponseEval(currentResponseEval);
            const finalScore = userEval.score + currentResponseEval.score;

            if (isFinalPart) {
                setTotalPartScore(finalScore); // Store score but don't complete yet
            } else {
                onComplete(finalScore);
            }

            setStatus('done');
            setTurn('ROUND_COMPLETE');
        }
    };

    const resetRound = () => {
        setTurn('SELECT_CARD');
        setUserCard(null);
        setShouldAutoplay(false);
    };

  return (
    <section className="p-6 sm:p-8 bg-white rounded-2xl shadow-md">
      <div className="text-left mb-8">
        <h2 className="text-3xl font-bold text-slate-700">{partName}</h2>
        <p className="text-md text-slate-500 mt-2">{instruction}</p>
        {instructionPersian && <p className="text-md text-slate-500 mt-1 font-persian text-right" dir="rtl">{instructionPersian}</p>}
      </div>

      {turn === 'SELECT_CARD' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cards.map(card => (
                    <button 
                        key={card.id} 
                        onClick={() => handleSelectCard(card)} 
                        className="bg-slate-50 p-0 rounded-lg border border-slate-200 h-48 overflow-hidden hover:shadow-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all transform hover:scale-105"
                    >
                        {renderCardContent(card)}
                    </button>
                ))}
            </div>
          </div>
      )}

      {userCard && (turn === 'USER_ACTION' || turn === 'EVALUATING_USER_ACTION') && (
          <div className="flex flex-col items-center w-full">
              <div className="w-full max-w-sm p-3 my-4 text-center rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-slate-700 font-semibold">{userActionText}</p>
                {userActionTextPersian && <p className="text-slate-600 mt-1 font-persian" dir="rtl">{userActionTextPersian}</p>}
              </div>
              <div className="bg-slate-50 p-0 rounded-lg border border-slate-200 flex justify-center items-center h-64 w-full max-w-sm overflow-hidden mb-6">
                  {renderCardContent(userCard)}
              </div>
               <button onClick={handleChangeCard} className="py-1 px-4 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 border border-slate-300 font-persian text-sm font-semibold transition-colors">
                    تعویض کارت
               </button>
              <RecordingTile
                  onRecordingComplete={handleUserActionRecording}
                  status={status}
                  result={userEval}
                  part={partName}
                  maxScore={maxScore / 2}
                  error={error}
              />
          </div>
      )}

      {turn === 'AI_ACTION' && userEval && (
          <div className="flex flex-col items-center">
               <p className="font-bold text-slate-700 mb-4">Ihre erste Runde:</p>
               {userEval.aiResponse && <AiMessage text={userEval.aiResponse} audioText={userEval.aiResponse} />}
                <div className="w-full max-w-lg bg-white p-6 rounded-lg border border-slate-200 space-y-4 text-base mt-4 shadow-sm">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-slate-700 text-lg">Ergebnis:</p>
                        <p className="font-bold text-xl text-blue-600">{userEval.score.toFixed(1)} / {(maxScore / 2).toFixed(1)}</p>
                    </div>
                    <p className="text-slate-600 italic">"{userEval.transcription}"</p>
                    <p className="text-slate-800 pt-3 border-t border-slate-200 font-persian text-right text-lg" dir="rtl">{userEval.feedback}</p>
                    {userEval.alternativeSentence && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="font-persian text-right text-sm text-green-800 font-bold" dir="rtl">یک پیشنهاد دیگر:</p>
                            <p className="text-green-900 italic text-right text-lg" dir="rtl">"{userEval.alternativeSentence}"</p>
                        </div>
                    )}
                </div>
               <button onClick={handleAiTurn} disabled={isAiThinking} className="mt-6 bg-blue-600 text-white font-bold py-2.5 px-8 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-wait flex items-center justify-center min-w-[120px] text-lg">
                {isAiThinking ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <span className="font-persian">ادامه</span>
                )}
               </button>
          </div>
      )}
      
      {aiCard && (turn === 'USER_RESPONSE' || turn === 'EVALUATING_USER_RESPONSE') && (
          <div className="flex flex-col items-center">
              <div className="w-full max-w-sm p-3 my-4 text-center rounded-lg bg-yellow-50 border border-yellow-200">
                  <p className="font-bold font-persian text-yellow-800">{aiActionText}</p>
              </div>
              <div className="bg-slate-50 p-0 rounded-lg border border-slate-200 flex justify-center items-center h-64 w-full max-w-sm overflow-hidden">
                  {renderCardContent(aiCard)}
              </div>
              {aiMessage && <AiMessage text={aiMessage} audioText={aiMessage} autoplay={shouldAutoplay}/>}
              <RecordingTile
                  onRecordingComplete={handleUserResponseRecording}
                  status={status}
                  result={responseEval}
                  part={partName}
                  maxScore={maxScore / 2}
                  error={error}
              />
          </div>
      )}
      
      {turn === 'ROUND_COMPLETE' && responseEval && (
          <div className="flex flex-col items-center">
               <p className="font-bold text-slate-700 mb-4">Zweite Runde (Antwort):</p>
                <div className="w-full max-w-lg bg-white p-6 rounded-lg border border-slate-200 space-y-4 text-base mt-4 shadow-sm">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-slate-700 text-lg">Ergebnis:</p>
                        <p className="font-bold text-xl text-blue-600">{responseEval.score.toFixed(1)} / {(maxScore / 2).toFixed(1)}</p>
                    </div>
                    <p className="text-slate-600 italic">"{responseEval.transcription}"</p>
                    <p className="text-slate-800 pt-3 border-t border-slate-200 font-persian text-right text-lg" dir="rtl">{responseEval.feedback}</p>
                    {responseEval.alternativeSentence && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="font-persian text-right text-sm text-green-800 font-bold" dir="rtl">یک پیشنهاد دیگر:</p>
                            <p className="text-green-900 italic text-right text-lg" dir="rtl">"{responseEval.alternativeSentence}"</p>
                        </div>
                    )}
                </div>
                {!isFinalPart ? (
                    <>
                        <div className="mt-8 p-3 rounded-md bg-green-100 border border-green-300">
                            <p className="font-persian text-green-800 font-semibold text-lg">این قسمت تموم شد برو قسمت 3</p>
                        </div>
                        <button onClick={resetRound} className="mt-6 bg-slate-600 text-white font-bold py-2.5 px-8 rounded-lg hover:bg-slate-700 font-persian text-lg">
                            انتخاب کارت دیگر
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => onComplete(totalPartScore)}
                        className="mt-8 bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 font-persian text-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                        پایان آزمون و مشاهده نتیجه
                    </button>
                )}
          </div>
      )}

    </section>
  );
};

export default InteractivePart;
