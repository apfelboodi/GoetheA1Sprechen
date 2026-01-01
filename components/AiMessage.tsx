import React from 'react';
import AudioPlayer from './AudioPlayer';

interface AiMessageProps {
  text: string;
  author?: string;
  audioText?: string;
  autoplay?: boolean;
}

const AiMessage: React.FC<AiMessageProps> = ({ text, author = "Prüfer", audioText, autoplay = false }) => {
  return (
    <div className="bg-yellow-50 p-4 rounded-lg rounded-bl-none max-w-lg w-full my-4 border border-yellow-200">
      <div className="flex justify-between items-center mb-1">
        <p className="font-bold text-sm text-yellow-800">{author}</p>
        {audioText && <AudioPlayer textToSpeak={audioText} isIcon={true} autoplay={autoplay} />}
      </div>
      <p className="text-yellow-900 whitespace-pre-wrap text-lg font-bold">{text}</p>
    </div>
  );
};

export default AiMessage;