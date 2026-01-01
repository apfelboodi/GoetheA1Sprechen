import React, { useState, useRef, useEffect } from 'react';
import type { RecordingStatus, EvaluationResult } from '../types';
import AudioPlayer from './AudioPlayer';

interface RecordingTileProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  status: RecordingStatus;
  result: EvaluationResult | null;
  error: string | null;
  part: string;
  maxScore: number;
  showSuggestionBox?: boolean;
}

const ScoreCircle = ({ score, maxScore }: { score: number, maxScore: number }) => {
    // Hide score circle if maxScore is 0 (for non-scored intro parts)
    if (maxScore === 0) return null;

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const clampedScore = Math.max(0, Math.min(score, maxScore));
    const offset = circumference - (clampedScore / maxScore) * circumference;

    return (
        <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                    className="text-slate-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50"
                    cy="50"
                />
                <circle
                    className="text-blue-500"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-700">{score.toFixed(1)}</span>
                <span className="text-base text-slate-500">/ {maxScore.toFixed(1)}</span>
            </div>
        </div>
    );
};

const RecordingTile: React.FC<RecordingTileProps> = (props) => {
  const { onRecordingComplete, status, result, error, part, maxScore, showSuggestionBox = true } = props;
  const [isRecording, setIsRecording] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup function to revoke the object URL and prevent memory leaks
    return () => {
        if (recordedAudioUrl) {
            URL.revokeObjectURL(recordedAudioUrl);
        }
    };
  }, [recordedAudioUrl]);

  const startRecording = async () => {
    setMicError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        audioChunksRef.current = [];

        mediaRecorderRef.current.onstart = () => {
            setIsRecording(true);
        }

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          setIsRecording(false);
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          if (recordedAudioUrl) {
            URL.revokeObjectURL(recordedAudioUrl);
          }
          setRecordedAudioUrl(URL.createObjectURL(audioBlob));
          onRecordingComplete(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
      } catch (err) {
        console.error("Error accessing microphone:", err);
        if (err instanceof DOMException) {
            if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setMicError("میکروفونی پیدا نشد. لطفاً از اتصال و فعال بودن میکروفون خود اطمینان حاصل کنید.");
            } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setMicError("دسترسی به میکروفون رد شد. لطفاً دسترسی را در تنظیمات مرورگر خود مجاز کنید.");
            } else {
                setMicError("هنگام دسترسی به میکروفون خطایی روی داد. لطفاً سخت افزار و مجوزهای خود را بررسی کنید.");
            }
        } else {
            setMicError("یک خطای ناشناخته هنگام دسترسی به میکروفون رخ داده است.");
        }
      }
    } else {
        setMicError("مرورگر شما از ضبط صدا پشتیبانی نمی‌کند.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };
  
  const handleStartRecording = () => {
      startRecording();
  };

  return (
    <div className="w-full flex flex-col items-center">
        <div className="mt-6 w-full max-w-lg flex flex-col justify-center">
             {isRecording ? (
                <button onClick={handleStopRecording} className="w-full bg-red-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center animate-pulse">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 10h.01M15 10h.01M9 14h6" /></svg>
                    Stopp
                </button>
             ) : (
                <>
                    {micError && (
                         <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm mb-4">
                            <p className="font-bold font-persian text-right" dir="rtl">خطای میکروفون</p>
                            <p className="font-persian text-right" dir="rtl">{micError}</p>
                            <button onClick={handleStartRecording} className="w-full text-xs text-red-700 font-semibold pt-1 text-center hover:underline">
                                <span className="font-persian">تلاش مجدد</span>
                            </button>
                        </div>
                    )}

                    {!micError && (status === 'evaluating') && (
                        <div className="text-center text-slate-600 py-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900 mx-auto mb-2"></div>
                            <span className="font-persian">در حال بررسی</span>
                        </div>
                    )}
                    
                    {status === 'done' && result && (
                        <div className="w-full p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-lg space-y-4 text-base mt-4">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                <ScoreCircle score={result.score} maxScore={maxScore} />
                                <div className="flex-1 space-y-3 w-full">
                                    <div>
                                        <p className="font-bold text-slate-500 text-xs uppercase tracking-wider">Transkription</p>
                                        <p className="text-slate-700 italic text-base">"{result.transcription}"</p>
                                        {recordedAudioUrl && (
                                            <AudioPlayer audioUrl={recordedAudioUrl} label="شنیدن صدای ضبط شده من" />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-slate-500 text-xs uppercase tracking-wider font-persian text-right" dir="rtl">بازخورد</p>
                                <p className="text-slate-800 font-persian text-right text-base" dir="rtl">{result.feedback}</p>
                            </div>
                             {showSuggestionBox && result.correctText && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="font-persian text-sm font-bold text-blue-800 text-right" dir="rtl">جمله پیشنهادی:</p>
                                    <p className="text-blue-900 text-left mt-2 text-base font-semibold whitespace-pre-wrap" dir="ltr">{result.correctText}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {status === 'error' && error && (
                        <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm mt-4">
                            <p className="font-bold">Fehler</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {!micError && (status === 'idle' || status === 'done' || status === 'error') && (
                        <button onClick={handleStartRecording} className="w-full bg-red-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center shadow-sm hover:shadow-md mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                                <path d="M5.5 14.5a.5.5 0 01.5-.5h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" />
                            </svg>
                            <span className="font-persian">{status === 'idle' ? 'ضبط' : 'دوباره بگو'}</span>
                        </button>
                    )}
                </>
             )}
        </div>
    </div>
  );
};

export default RecordingTile;