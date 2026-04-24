import { motion } from 'framer-motion';
import { CipherType, CipherConfig } from '../types';

const cipherConfigs: CipherConfig[] = [
  {
    type: 'caesar',
    name: 'Caesar Cipher',
    description: 'Simple shift cipher',
    keyFields: [{ name: 'shift', type: 'number', label: 'Shift', defaultValue: 3 }]
  },
  {
    type: 'affine',
    name: 'Affine Cipher',
    description: 'Linear transformation',
    keyFields: [
      { name: 'a', type: 'number', label: 'Multiplier (a)', defaultValue: 5 },
      { name: 'b', type: 'number', label: 'Shift (b)', defaultValue: 8 }
    ]
  },
  {
    type: 'atbash',
    name: 'Atbash Cipher',
    description: 'Reverse alphabet',
    keyFields: []
  },
  {
    type: 'vigenere',
    name: 'Vigenère Cipher',
    description: 'Polyalphabetic substitution',
    keyFields: [{ name: 'key', type: 'text', label: 'Key', defaultValue: 'KEY' }]
  },
  {
    type: 'playfair',
    name: 'Playfair Cipher',
    description: '5×5 grid digraph cipher',
    keyFields: [{ name: 'key', type: 'text', label: 'Key', defaultValue: 'MONARCHY' }]
  },
  {
    type: 'railfence',
    name: 'Rail Fence Cipher',
    description: 'Transposition zigzag pattern',
    keyFields: [{ name: 'rails', type: 'number', label: 'Rails', defaultValue: 3 }]
  },
  {
    type: 'autokey',
    name: 'Autokey Cipher',
    description: 'Self-extending keyword cipher',
    keyFields: [{ name: 'key', type: 'text', label: 'Keyword', defaultValue: 'QUEEN' }]
  },
  {
    type: 'columnar',
    name: 'Columnar Transposition',
    description: 'Column reordering cipher',
    keyFields: [{ name: 'key', type: 'text', label: 'Keyword', defaultValue: 'SECRET' }]
  }
];

const colors = ['bg-yellow-300', 'bg-pink-400', 'bg-cyan-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400', 'bg-red-400', 'bg-teal-400'];

interface CipherSelectorProps {
  selectedCipher: CipherType;
  onSelectCipher: (cipher: CipherType) => void;
}

export default function CipherSelector({ selectedCipher, onSelectCipher }: CipherSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 rounded-2xl"
    >
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-black mb-6 uppercase">
        Select Cipher
      </h2>
      
      <div className="space-y-4">
        {cipherConfigs.map((config, index) => (
          <motion.button
            key={config.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            // whileHover={{ scale: 1.02 }}
            // whileTap={{ scale: 0.98 }}
            onClick={() => {
              console.log('Cipher selected:', config.type);
              onSelectCipher(config.type);
            }}
            className={`w-full p-4 text-left border-4 border-black rounded-xl cursor-pointer ${
              selectedCipher === config.type
                ? `${colors[index]} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] translate-x-1 translate-y-1`
                : 'bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-black text-lg uppercase">{config.name}</h3>
                <p className="text-sm font-bold mt-1">
                  {config.description}
                </p>
              </div>
              {selectedCipher === config.type && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-black border-2 border-black flex items-center justify-center rounded-full"
                >
                  <span className="text-white font-black">✓</span>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
