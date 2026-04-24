import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function parseCipherFromHash(): string | null {
  const hash = window.location.hash.replace('#', '');
  const match = hash.match(/\/cipher\/(\w+)/);
  return match ? match[1] : null;
}

export default function DiffPage() {
  const [cipher, setCipher] = useState<string | null>(parseCipherFromHash());

  useEffect(() => {
    const handler = () => setCipher(parseCipherFromHash());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  if (!cipher) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-purple-100 dark:border-purple-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Diff — {cipher}</h2>
        <button onClick={() => { window.location.hash = ''; }} className="text-sm text-purple-600 hover:underline">Close</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <h3 className="font-semibold mb-2">Before</h3>
          <pre className="text-sm font-mono bg-transparent">Example input or description of the original algorithm.</pre>
        </div>

        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <h3 className="font-semibold mb-2">After</h3>
          <pre className="text-sm font-mono bg-transparent">Example output or transformed implementation (diff view, code, notes).</pre>
        </div>
      </div>
    </motion.div>
  );
}
