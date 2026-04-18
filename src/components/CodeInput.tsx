import { Code2 } from 'lucide-react';

interface CodeInputProps {
  code: string;
  onChange: (code: string) => void;
}

export default function CodeInput({ code, onChange }: CodeInputProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/20 shadow-xl shadow-amber-500/5">
      <div className="flex items-center gap-3 mb-4">
        <Code2 className="w-6 h-6 text-amber-400" />
        <h2 className="text-2xl font-bold text-amber-200">Your Code</h2>
      </div>

      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your code here... We dare you."
        className="w-full h-64 bg-black/40 border border-gray-700 rounded-xl p-4 text-gray-100 placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 resize-none transition-all"
        spellCheck={false}
      />

      <div className="mt-3 text-sm text-gray-500">
        Supports any programming language. The AI will judge accordingly.
      </div>
    </div>
  );
}
