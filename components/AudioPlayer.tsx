import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

// Helper functions for audio decoding
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface AudioPlayerProps {
  textToSpeak?: string;
  audioUrl?: string;
  label?: string;
  isSpelling?: boolean;
  isNumber?: boolean;
  isIcon?: boolean;
  autoplay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = (props) => {
  const { textToSpeak, audioUrl, label, isSpelling = false, isNumber = false, isIcon = false, autoplay = false } = props;
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasAutoplayed = useRef(false);

  const handlePlayAudio = async () => {
    if (isGeneratingAudio) return;

    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
        return;
    }
    
    if (!textToSpeak) return;

    setIsGeneratingAudio(true);
    try {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioContext = audioContextRef.current;

        let textForTTS: string;

        if (isSpelling) {
          const letters = textToSpeak.split(' ').join(', ');
          textForTTS = `Ich buchstabiere auf Deutsch: ${letters}.`;
        } else if (isNumber) {
          textForTTS = textToSpeak;
        }
        else {
          textForTTS = textToSpeak;
        }

        // FIX: Use process.env.API_KEY instead of import.meta.env.VITE_API_KEY
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: textForTTS }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' }, // A standard, clear German-sounding voice
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                audioContext,
                24000,
                1,
            );
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();
        } else {
            throw new Error("No audio data received from API.");
        }
    } catch (err) {
        console.error("Error generating or playing audio:", err);
    } finally {
        setIsGeneratingAudio(false);
    }
  };

  useEffect(() => {
    if (autoplay && !hasAutoplayed.current) {
      hasAutoplayed.current = true;
      handlePlayAudio();
    }
  }, [autoplay]);
  
  const buttonContent = (
      <>
        {isGeneratingAudio ? (
          <svg className="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
        )}
        {label && <span className="font-persian">{label}</span>}
      </>
  );

  if (isIcon) {
    return (
        <button
            onClick={handlePlayAudio}
            disabled={isGeneratingAudio}
            className="p-1 rounded-full text-slate-600 hover:bg-slate-200 disabled:text-slate-300 disabled:cursor-wait transition-colors"
        >
            {isGeneratingAudio ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" /></svg>
            )}
        </button>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto flex justify-center mt-4">
      <button
        onClick={handlePlayAudio}
        disabled={isGeneratingAudio}
        className="flex items-center justify-center gap-2 text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-wait font-semibold py-2 px-4 rounded-lg transition-colors border border-slate-300 shadow-sm"
      >
        {buttonContent}
      </button>
    </div>
  );
};

export default AudioPlayer;
