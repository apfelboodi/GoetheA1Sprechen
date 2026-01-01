import React, { useMemo } from 'react';
import { part2Cards } from '../constants';
import InteractivePart from './InteractivePart';

interface Part2Props {
  onComplete: (score: number) => void;
}

const Part2: React.FC<Part2Props> = ({ onComplete }) => {
  const allCards = useMemo(() => {
    return Object.entries(part2Cards).flatMap(([theme, cards]) => 
      cards.map(card => ({ ...card, theme, id: card.word }))
    );
  }, []);

  const getAiResponsePrompt = (transcription: string) => 
    `The user asked: "${transcription}". Answer this question very simply, in one sentence, at a German A1 level.`;

  const getAiQuestionPrompt = (card: any) => 
    `You are a Goethe A1 examiner. Ask a simple German question (A1 level) about the word "${card.word}" on the topic "${card.theme}". Return ONLY the question text. Speak clearly at a natural, calm pace appropriate for an A1-level learner. Avoid unnatural pauses or speaking too quickly.`;

  const renderCard = (card: any) => (
    <img src={card.imageUrl} alt={card.word} className="h-full w-auto mx-auto" />
  );
  
  const userActionTextPersian = (
    <>
      یک سوال در مورد کارت زیر بپرس <br /> و بعد روی دکمه <strong>ادامه</strong> بزن و به سوال جواب بده
    </>
  );

  return (
    <InteractivePart
      partName="Teil 2"
      instruction="Um Informationen bitten und Informationen geben."
      instructionPersian="اطلاعات دادن و اطلاعات گرفتن (یکی از کارتهای زیر رو انتخاب کن)"
      cards={allCards}
      userActionText="Stellen Sie eine Frage zu dieser Karte."
      userActionTextPersian={userActionTextPersian}
      aiActionText="به سوال زیر جواب بده"
      getAiResponsePrompt={getAiResponsePrompt}
      getAiQuestionPrompt={getAiQuestionPrompt}
      renderCardContent={renderCard}
      maxScore={6}
      onComplete={onComplete}
    />
  );
};

export default Part2;