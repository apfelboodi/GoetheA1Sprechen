import React, { useState } from 'react';
import Part1 from './components/Part1';
import Part2 from './components/Part2';
import Part3 from './components/Part3';
import FinalScoreDisplay from './components/FinalScoreDisplay';

const App: React.FC = () => {
  const [scores, setScores] = useState({ part1: 0, part2: 0, part3: 0 });
  const [examStatus, setExamStatus] = useState<'ongoing' | 'finished'>('ongoing');

  const handlePart1Complete = (score: number) => {
    setScores(s => ({ ...s, part1: score }));
  };
  const handlePart2Complete = (score: number) => {
    setScores(s => ({ ...s, part2: score }));
  };
  const handlePart3Complete = (score: number) => {
    setScores(s => ({ ...s, part3: score }));
    setExamStatus('finished');
  };

  const resetExam = () => {
    setScores({ part1: 0, part2: 0, part3: 0 });
    setExamStatus('ongoing');
    // We might need a more robust way to reset state within children,
    // for now, we can re-render them with a key change.
    window.location.reload(); 
  };


  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 text-slate-800 bg-slate-50">
      <header className="w-full max-w-4xl mx-auto text-center p-8 bg-white rounded-2xl shadow-md mb-12">
        <h2 className="text-lg text-slate-600 tracking-widest">Kandidatenblätter</h2>
        <hr className="my-4 border-slate-300 w-full max-w-md mx-auto" />
        <h1 className="text-7xl font-bold text-black tracking-tight">Sprechen</h1>
        <p className="text-base text-slate-800 mt-2">circa 15 Minuten</p>
        <div className="mt-10 space-y-1">
            <p className="text-xl text-slate-600">Dieser Test hat drei Teile.</p>
            <p className="text-xl text-slate-600">Sprechen Sie bitte in der Gruppe.</p>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto space-y-12">
        <Part1 onComplete={handlePart1Complete} />
        <Part2 onComplete={handlePart2Complete} />
        <Part3 onComplete={handlePart3Complete} />
      </main>
      
      {examStatus === 'finished' && (
        <FinalScoreDisplay scores={scores} onReset={resetExam} />
      )}

      <footer className="w-full max-w-4xl mx-auto text-center mt-12 py-4 text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} www.apfel.ir. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;