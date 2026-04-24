import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FrequencyAnalysisProps {
  plaintext: string;
  ciphertext: string;
}

export default function FrequencyAnalysis({ plaintext, ciphertext }: FrequencyAnalysisProps) {
  const analyzeFrequency = (text: string) => {
    const freq: Record<string, number> = {};
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    
    for (const char of cleanText) {
      freq[char] = (freq[char] || 0) + 1;
    }
    
    return Object.entries(freq)
      .map(([letter, count]) => ({
        letter,
        count,
        percentage: ((count / cleanText.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);
  };

  const plaintextFreq = analyzeFrequency(plaintext);
  const ciphertextFreq = analyzeFrequency(ciphertext);

  const chartData = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => {
    const plainCount = plaintextFreq.find(f => f.letter === letter)?.count || 0;
    const cipherCount = ciphertextFreq.find(f => f.letter === letter)?.count || 0;
    return {
      letter,
      Plaintext: plainCount,
      Ciphertext: cipherCount
    };
  });

  if (!plaintext && !ciphertext) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 rounded-2xl"
    >
      <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-black mb-6 uppercase">
        Frequency Analysis
      </h3>

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis 
              dataKey="letter" 
              stroke="#000000"
              style={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <YAxis 
              stroke="#000000"
              style={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '4px solid #000000',
                borderRadius: '0',
                fontWeight: 'bold',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
              }}
            />
            <Legend 
              wrapperStyle={{ 
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            />
            <Bar dataKey="Plaintext" fill="#22d3ee" stroke="#000000" strokeWidth={2} />
            <Bar dataKey="Ciphertext" fill="#ec4899" stroke="#000000" strokeWidth={2} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-cyan-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
          <h4 className="text-sm font-black text-black mb-3 uppercase">Plaintext Top 5</h4>
          <div className="space-y-2">
            {plaintextFreq.slice(0, 5).map(({ letter, count, percentage }) => (
              <div key={letter} className="flex justify-between items-center">
                <span className="font-black text-lg">{letter}</span>
                <span className="bg-black text-cyan-300 px-3 py-1 font-black text-sm rounded-lg">
                  {count} ({percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-pink-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
          <h4 className="text-sm font-black text-black mb-3 uppercase">Ciphertext Top 5</h4>
          <div className="space-y-2">
            {ciphertextFreq.slice(0, 5).map(({ letter, count, percentage }) => (
              <div key={letter} className="flex justify-between items-center">
                <span className="font-black text-lg">{letter}</span>
                <span className="bg-black text-pink-300 px-3 py-1 font-black text-sm rounded-lg">
                  {count} ({percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
