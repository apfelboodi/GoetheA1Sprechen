import React from 'react';
import { part3Cards } from '../constants';
import InteractivePart from './InteractivePart';

interface Part3Props {
    onComplete: (score: number) => void;
}

const Part3: React.FC<Part3Props> = ({ onComplete }) => {
    const allCards = part3Cards.map((card, index) => ({ ...card, id: `card-${index}`}));

    const getAiResponsePrompt = (transcription: string) =>
        `The user made a request: "${transcription}". Respond to this request very simply, in one sentence, at a German A1 level.`;

    const getAiQuestionPrompt = (card: any) =>
        `You are a Goethe A1 examiner. Look at the image (theme: ${card.title}) and make a simple German request (Bitte) at an A1 level related to it. Return ONLY the request text. Speak clearly at a natural, calm pace appropriate for an A1-level learner. Avoid unnatural pauses or speaking too quickly.`;

    const renderCard = (card: any) => {
        return (
            <img src={card.imageUrl} alt={card.title} className="h-full w-auto mx-auto" />
        );
    };

    const userActionTextPersian = (
        <>
            با توجه به کارت زیر یه درخواست بده <br /> و بعد روی دکمه <strong>ادامه</strong> بزن و به سوال جواب بده
        </>
    );

    return (
        <InteractivePart
            partName="Teil 3"
            instruction="Bitten formulieren und darauf reagieren."
            instructionPersian="درخواست بده و به درخواست ها واکنش نشون بده"
            cards={allCards}
            userActionText="Formulieren Sie eine Bitte mit dieser Karte."
            userActionTextPersian={userActionTextPersian}
            aiActionText="Jetzt habe ich eine Bitte."
            getAiResponsePrompt={getAiResponsePrompt}
            getAiQuestionPrompt={getAiQuestionPrompt}
            renderCardContent={renderCard}
            maxScore={6}
            onComplete={onComplete}
            isFinalPart={true}
        />
    );
};

export default Part3;