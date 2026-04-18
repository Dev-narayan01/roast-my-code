import { useState } from 'react';
import { Flame, Skull, Sprout } from 'lucide-react';
import CodeInput from './components/CodeInput';
import RoastResult from './components/RoastResult';

export type RoastLevel = 'mild' | 'medium' | 'brutal';

export interface RoastResponse {
  score: number;
  verdict: string;
  roast: string;
  compliment: string;
}

function App() {
  const [code, setCode] = useState('');
  const [roastLevel, setRoastLevel] = useState<RoastLevel>('medium');
  const [result, setResult] = useState<RoastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoast = async () => {
    if (!code.trim()) {
      setError('Please paste some code first!');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const roastInstructions = {
        mild: 'Be like a senior dev doing a friendly code review. Point out issues with light sarcasm but stay encouraging. Make them smile, not cry.',
        medium: 'Be a grumpy tech lead who has seen too much bad code. Be sharp, witty, and brutally honest. No sugarcoating, but keep it professional.',
        brutal: 'You are a furious 10x developer who has just been handed the worst code of their career. Absolutely destroy this code. Be merciless, savage, and viciously funny. Mock every bad decision, every lazy shortcut, every violation of basic programming principles. Make them question their career choices. Channel the energy of a disappointed professor, an angry Stack Overflow veteran, and a traumatized code reviewer all at once.',
      };

      const prompt = `You are the most brutally honest and savage code reviewer on the internet. You have zero tolerance for bad code and an infinite supply of sarcasm.

Roast level: ${roastLevel.toUpperCase()}
Instructions: ${roastInstructions[roastLevel]}

Analyze this code and respond ONLY with a JSON object with these exact fields:
- score: number from 1-10 (be harsh, most code deserves below 5)
- verdict: a single devastating one-liner (max 15 words, make it sting)
- roast: a savage, specific, technically accurate roast (4-6 sentences). Reference actual problems in the code. Use dark humor. Be specific about what's wrong and why it's embarrassing.
- compliment: one reluctant, backhanded compliment (1 sentence max, still slightly insulting)

Code to destroy:
\`\`\`
${code}
\`\`\`

Return ONLY valid JSON. No markdown, no backticks, no explanation. Just raw JSON.`;

      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: prompt }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to roast your code');
      }

      const groqData = await response.json();
      const content = groqData.choices[0].message.content;

      let data;
      try {
        data = JSON.parse(content);
      } catch {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) data = JSON.parse(jsonMatch[0]);
        else throw new Error('Could not parse response');
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.1),transparent_50%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-2xl" />
              <h1 className="relative text-6xl md:text-7xl font-black tracking-tight mb-2 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                ROAST MY CODE
              </h1>
            </div>
          </div>
          <p className="text-xl text-amber-100/70 font-light">
            Step into the spotlight. Let's see what you're working with.
          </p>
        </header>

        {!result ? (
          <div className="space-y-8">
            <CodeInput code={code} onChange={setCode} />

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/20 shadow-xl shadow-amber-500/5">
              <h2 className="text-2xl font-bold mb-6 text-amber-200">Choose Your Pain</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button
                  onClick={() => setRoastLevel('mild')}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    roastLevel === 'mild'
                      ? 'border-green-400 bg-green-400/10 shadow-lg shadow-green-400/20'
                      : 'border-gray-700 hover:border-green-400/50 bg-gray-800/30'
                  }`}
                >
                  <Sprout className="w-8 h-8 mb-3 text-green-400 mx-auto" />
                  <div className="text-lg font-bold text-green-300 mb-1">Mild</div>
                  <div className="text-sm text-gray-400">Gentle roasting</div>
                </button>

                <button
                  onClick={() => setRoastLevel('medium')}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    roastLevel === 'medium'
                      ? 'border-orange-400 bg-orange-400/10 shadow-lg shadow-orange-400/20'
                      : 'border-gray-700 hover:border-orange-400/50 bg-gray-800/30'
                  }`}
                >
                  <Flame className="w-8 h-8 mb-3 text-orange-400 mx-auto" />
                  <div className="text-lg font-bold text-orange-300 mb-1">Medium</div>
                  <div className="text-sm text-gray-400">Some heat</div>
                </button>

                <button
                  onClick={() => setRoastLevel('brutal')}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    roastLevel === 'brutal'
                      ? 'border-red-400 bg-red-400/10 shadow-lg shadow-red-400/20'
                      : 'border-gray-700 hover:border-red-400/50 bg-gray-800/30'
                  }`}
                >
                  <Skull className="w-8 h-8 mb-3 text-red-400 mx-auto" />
                  <div className="text-lg font-bold text-red-300 mb-1">Brutal</div>
                  <div className="text-sm text-gray-400">No mercy</div>
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
                  {error}
                </div>
              )}

              <button
                onClick={handleRoast}
                disabled={loading}
                className="w-full py-4 px-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-bold text-lg text-gray-900 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? 'ROASTING...' : 'ROAST MY CODE'}
              </button>
            </div>
          </div>
        ) : (
          <RoastResult result={result} onReset={() => setResult(null)} />
        )}
      </div>
    </div>
  );
}

export default App;
