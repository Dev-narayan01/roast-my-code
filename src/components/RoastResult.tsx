import { useState } from 'react';
import { Copy, Check, RotateCcw, Trophy, Flame, Heart } from 'lucide-react';
import type { RoastResponse } from '../App';

interface RoastResultProps {
  result: RoastResponse;
  onReset: () => void;
}

export default function RoastResult({ result, onReset }: RoastResultProps) {
  const [copied, setCopied] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 5) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Impressive';
    if (score >= 5) return 'Not Bad';
    return 'Needs Work';
  };

  const handleCopy = async () => {
    const text = `🎭 ROAST MY CODE 🎭

📊 SCORE: ${result.score}/10
${result.verdict}

🔥 THE ROAST:
${result.roast}

💝 BUT ACTUALLY:
${result.compliment}

---
Get roasted at: roastmycode.app`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/20 shadow-xl shadow-amber-500/10">
        <div className="text-center mb-8">
          <div className="inline-block relative mb-4">
            <div className="absolute inset-0 bg-amber-500/20 blur-xl" />
            <div className={`relative text-7xl font-black ${getScoreColor(result.score)}`}>
              {result.score}<span className="text-4xl text-gray-500">/10</span>
            </div>
          </div>
          <div className="text-sm uppercase tracking-wider text-gray-400 mb-2">
            {getScoreLabel(result.score)}
          </div>
          <div className="text-2xl font-bold text-amber-200 italic">
            "{result.verdict}"
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-black/30 rounded-xl p-6 border border-red-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-red-400" />
              <h3 className="font-bold text-red-300">The Roast</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{result.roast}</p>
          </div>

          <div className="bg-black/30 rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-green-400" />
              <h3 className="font-bold text-green-300">But Actually...</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{result.compliment}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-xl font-bold text-gray-900 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Roast Card
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-5 h-5" />
            Roast Again
          </button>
        </div>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-amber-400/60 text-sm">
          <Trophy className="w-4 h-4" />
          <span>Another developer roasted. You're welcome.</span>
        </div>
      </div>
    </div>
  );
}
