import React from 'react';

interface FinalScoreDisplayProps {
    scores: {
        part1: number;
        part2: number;
        part3: number;
    };
    onReset: () => void;
}

const FinalScoreDisplay: React.FC<FinalScoreDisplayProps> = ({ scores, onReset }) => {
    const maxScores = { part1: 3, part2: 6, part3: 6 };
    const totalRawScore = scores.part1 + scores.part2 + scores.part3;
    const totalMaxRawScore = maxScores.part1 + maxScores.part2 + maxScores.part3; // Should be 15
    
    // Scale the raw score (out of 15) to the final score (out of 25) based on the PDF (15 * 1.666... = 25)
    const totalFinalScore = totalRawScore * (25 / totalMaxRawScore);
    const totalMaxFinalScore = 25;

    const percentage = totalMaxFinalScore > 0 ? (totalFinalScore / totalMaxFinalScore) * 100 : 0;

    const getRating = (p: number): { text: string; persian: string; passed: boolean } => {
        if (p >= 90) return { text: 'Sehr gut', persian: 'بسیار خوب (قبول)', passed: true };
        if (p >= 80) return { text: 'Gut', persian: 'خوب (قبول)', passed: true };
        if (p >= 70) return { text: 'Befriedigend', persian: 'رضایت‌بخش (قبول)', passed: true };
        if (p >= 60) return { text: 'Ausreichend', persian: 'کافی (قبول)', passed: true };
        return { text: 'Nicht bestanden', persian: 'مردود', passed: false };
    };

    const rating = getRating(percentage);
    const passed = rating.passed;

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    const containerClasses = passed 
      ? "bg-green-50 border-green-200" 
      : "bg-red-50 border-red-200";
      
    const circleClasses = passed ? "text-green-500" : "text-red-500";
    const headerClasses = passed ? "text-green-800" : "text-red-800";


    return (
        <section className={`mt-12 w-full max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl shadow-md text-center transition-colors duration-500 ${containerClasses}`}>
            <h2 className={`text-3xl font-bold ${headerClasses}`}>Gesamtergebnis</h2>
            <p className="text-md text-slate-500 mt-1 font-persian text-center" dir="rtl">نمره نهایی</p>

            <div className="my-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                <div className="relative w-48 h-48">
                    <svg className="w-full h-full" viewBox="0 0 140 140">
                        <circle className="text-slate-200" strokeWidth="12" stroke="currentColor" fill="transparent" r={radius} cx="70" cy="70" />
                        <circle
                            className={circleClasses}
                            strokeWidth="12"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="70"
                            cy="70"
                            transform="rotate(-90 70 70)"
                            style={{ transition: 'stroke-dashoffset 0.8s ease-out, color 0.5s' }}
                        />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                        <span className={`text-5xl font-bold ${headerClasses}`}>{percentage.toFixed(0)}%</span>
                    </div>
                </div>
                <div className="text-left space-y-4">
                    <div className="space-y-1">
                        <p className="text-lg font-semibold text-slate-600">
                            Teil 1: <span className="font-bold text-slate-800">{scores.part1.toFixed(1)} / {maxScores.part1.toFixed(1)}</span>
                        </p>
                        <p className="text-lg font-semibold text-slate-600">
                            Teil 2: <span className="font-bold text-slate-800">{scores.part2.toFixed(1)} / {maxScores.part2.toFixed(1)}</span>
                        </p>
                        <p className="text-lg font-semibold text-slate-600">
                            Teil 3: <span className="font-bold text-slate-800">{scores.part3.toFixed(1)} / {maxScores.part3.toFixed(1)}</span>
                        </p>
                    </div>
                    <hr className="my-2 border-slate-300" />
                     <div className="space-y-1">
                        <p className="text-lg font-semibold text-slate-700">
                            Punkte: <span className="font-bold text-slate-900">{totalRawScore.toFixed(1)} / {totalMaxRawScore.toFixed(1)}</span>
                        </p>
                        <p className="text-3xl font-bold text-slate-800">
                            Gesamtnote: <span className={headerClasses}>{totalFinalScore.toFixed(1)} / {totalMaxFinalScore.toFixed(1)}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-center space-y-2">
                <p className={`text-2xl font-bold ${headerClasses}`}>{rating.text}</p>
                <p className={`text-xl font-persian font-semibold ${headerClasses}`}>{rating.persian}</p>
            </div>

            {!passed && (
                <p className="mt-4 text-red-700 font-persian font-semibold">
                    (برای قبولی باید حداقل 60 درصد از نمره کل رو بگیرید)
                </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                    href="https://apfel.ir/prufungen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-slate-600 text-white font-bold py-2.5 px-8 rounded-lg hover:bg-slate-700 transition-colors font-persian text-lg text-center"
                >
                    صفحه اول آزمون ها
                </a>
                <button
                    onClick={onReset}
                    className="w-full sm:w-auto bg-blue-600 text-white font-bold py-2.5 px-8 rounded-lg hover:bg-blue-700 transition-colors font-persian text-lg"
                >
                    آزمون مجدد
                </button>
            </div>
        </section>
    );
};

export default FinalScoreDisplay;