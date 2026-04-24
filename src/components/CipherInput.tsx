import { useState } from 'react';
import { motion } from 'framer-motion';
import { CipherType, CipherOptions, CipherResult } from '../types';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { caesarEncrypt, caesarDecrypt } from '../ciphers/caesar';
import { affineEncrypt, affineDecrypt } from '../ciphers/affine';
import { atbashCipher } from '../ciphers/atbash';
import { vigenereEncrypt, vigenereDecrypt } from '../ciphers/vigenere';
import { playfairEncrypt, playfairDecrypt } from '../ciphers/playfair';
import { railFenceEncrypt, railFenceDecrypt } from '../ciphers/railfence';
import { autokeyEncrypt, autokeyDecrypt } from '../ciphers/autokey';
import { columnarEncrypt, columnarDecrypt } from '../ciphers/columnar';

interface CipherInputProps {
  selectedCipher: CipherType;
  options: CipherOptions;
  onOptionsChange: (options: CipherOptions) => void;
  onGenerate: (result: CipherResult) => void;
  plaintext: string;
  onPlaintextChange: (text: string) => void;
}

const testCases: Record<CipherType, { plaintext: string; key: any }> = {
  caesar: { plaintext: 'HELLO', key: { shift: 3 } },
  affine: { plaintext: 'HELLO', key: { a: 5, b: 8 } },
  atbash: { plaintext: 'HELLO', key: {} },
  vigenere: { plaintext: 'HELLO', key: { key: 'KEY' } },
  playfair: { plaintext: 'HELLO', key: { key: 'MONARCHY' } },
  railfence: { plaintext: 'HELLO', key: { rails: 3 } },
  beaufort: { plaintext: 'HELLO', key: { key: 'KEY' } },
  autokey: { plaintext: 'ATTACK AT DAWN', key: { key: 'QUEEN' } },
  hill: { plaintext: 'HI', key: { matrix: [[3, 3], [2, 5]] } },
  otp: { plaintext: 'HELLO', key: { key: 'XMCKL' } },
  columnar: { plaintext: 'ATTACK AT DAWN', key: { key: 'SECRET' } },
  scytale: { plaintext: 'HELLO', key: { diameter: 3 } },
  adfgx: { plaintext: 'HELLO', key: { key: 'KEY' } },
  adfgvx: { plaintext: 'HELLO', key: { key: 'KEY' } },
  bacon: { plaintext: 'HELLO', key: {} },
  homophonic: { plaintext: 'HELLO', key: {} }
};

export default function CipherInput({ 
  selectedCipher, 
  options, 
  onOptionsChange, 
  onGenerate,
  plaintext,
  onPlaintextChange
}: CipherInputProps) {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [keyValues, setKeyValues] = useState<Record<string, any>>({
    shift: 3,
    a: 5,
    b: 8,
    key: 'KEY',
    rails: 3
  });

  const handleEncrypt = () => {
    console.log('Encrypt called with:', { plaintext, selectedCipher, keyValues, options });
    let result: CipherResult;

    switch (selectedCipher) {
      case 'caesar':
        result = caesarEncrypt(plaintext, keyValues.shift || 3, options);
        break;
      case 'affine':
        result = affineEncrypt(plaintext, keyValues.a || 5, keyValues.b || 8, options);
        break;
      case 'atbash':
        result = atbashCipher(plaintext, options);
        break;
      case 'vigenere':
        result = vigenereEncrypt(plaintext, keyValues.key || 'KEY', options);
        break;
      case 'playfair':
        result = playfairEncrypt(plaintext, keyValues.key || 'MONARCHY', options);
        break;
      case 'railfence':
        result = railFenceEncrypt(plaintext, keyValues.rails || 3, options);
        break;
      case 'autokey':
        result = autokeyEncrypt(plaintext, keyValues.key || 'QUEEN', options);
        break;
      case 'columnar':
        result = columnarEncrypt(plaintext, keyValues.key || 'SECRET', options);
        break;
      default:
        result = caesarEncrypt(plaintext, 3, options);
    }

    onGenerate(result);
  };

  const handleDecrypt = () => {
    let result: CipherResult;

    switch (selectedCipher) {
      case 'caesar':
        result = caesarDecrypt(plaintext, keyValues.shift || 3, options);
        break;
      case 'affine':
        result = affineDecrypt(plaintext, keyValues.a || 5, keyValues.b || 8, options);
        break;
      case 'atbash':
        result = atbashCipher(plaintext, options);
        break;
      case 'vigenere':
        result = vigenereDecrypt(plaintext, keyValues.key || 'KEY', options);
        break;
      case 'playfair':
        result = playfairDecrypt(plaintext, keyValues.key || 'MONARCHY', options);
        break;
      case 'railfence':
        result = railFenceDecrypt(plaintext, keyValues.rails || 3, options);
        break;
      case 'autokey':
        result = autokeyDecrypt(plaintext, keyValues.key || 'QUEEN', options);
        break;
      case 'columnar':
        result = columnarDecrypt(plaintext, keyValues.key || 'SECRET', options);
        break;
      default:
        result = caesarDecrypt(plaintext, 3, options);
    }

    onGenerate(result);
  };

  const loadTestCase = () => {
    const testCase = testCases[selectedCipher];
    console.log('Loading test case:', { selectedCipher, testCase });
    onPlaintextChange(testCase.plaintext);
    setKeyValues({ ...keyValues, ...testCase.key });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-black uppercase">
          Configuration
        </h2>
        <button
          onClick={loadTestCase}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-yellow-300 border-4 border-black font-black uppercase hover:translate-x-1 hover:translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none rounded-xl"
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          Example
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMode('encrypt')}
          className={`flex-1 py-4 px-4 font-black uppercase border-4 border-black transition-all rounded-xl ${
            mode === 'encrypt'
              ? 'bg-cyan-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] translate-x-1 translate-y-1'
              : 'bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          Encrypt
        </button>
        <button
          onClick={() => setMode('decrypt')}
          className={`flex-1 py-4 px-4 font-black uppercase border-4 border-black transition-all rounded-xl ${
            mode === 'decrypt'
              ? 'bg-pink-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] translate-x-1 translate-y-1'
              : 'bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          Decrypt
        </button>
      </div>

      {/* Input Field */}
      <div className="mb-6">
        <label className="block text-sm font-black text-black mb-2 uppercase">
          {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'}
        </label>
        <textarea
          value={plaintext}
          onChange={(e) => {
            console.log('Text changed:', e.target.value);
            onPlaintextChange(e.target.value);
          }}
          className="w-full px-4 py-3 border-4 border-black bg-yellow-100 text-black placeholder:text-black/40 focus:outline-none focus:ring-4 focus:ring-cyan-400 resize-none font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl"
          rows={3}
          placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter text to decrypt...'}
        />
      </div>

      {/* Key Inputs */}
      {selectedCipher === 'caesar' && (
        <div className="mb-6">
          <label className="block text-sm font-black text-black mb-2 uppercase">
            Shift Value
          </label>
          <input
            type="number"
            value={keyValues.shift || 3}
            onChange={(e) => setKeyValues({ ...keyValues, shift: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 border-4 border-black bg-pink-100 text-black font-bold focus:outline-none focus:ring-4 focus:ring-pink-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl"
          />
        </div>
      )}

      {selectedCipher === 'affine' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-black text-black mb-2 uppercase">
              Multiplier (a)
            </label>
            <input
              type="number"
              value={keyValues.a || 5}
              onChange={(e) => setKeyValues({ ...keyValues, a: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 border-4 border-black bg-cyan-100 text-black font-bold focus:outline-none focus:ring-4 focus:ring-cyan-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-black mb-2 uppercase">
              Shift (b)
            </label>
            <input
              type="number"
              value={keyValues.b || 8}
              onChange={(e) => setKeyValues({ ...keyValues, b: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 border-4 border-black bg-green-100 text-black font-bold focus:outline-none focus:ring-4 focus:ring-green-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl"
            />
          </div>
        </div>
      )}

      {(selectedCipher === 'vigenere' || selectedCipher === 'playfair' || selectedCipher === 'autokey' || selectedCipher === 'columnar') && (
        <div className="mb-6">
          <label className="block text-sm font-black text-black mb-2 uppercase">
            Key
          </label>
          <input
            type="text"
            value={keyValues.key || 'KEY'}
            onChange={(e) => setKeyValues({ ...keyValues, key: e.target.value })}
              className="w-full px-4 py-3 border-4 border-black bg-purple-100 text-black font-bold focus:outline-none focus:ring-4 focus:ring-purple-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl"
          />
        </div>
      )}

      {selectedCipher === 'railfence' && (
        <div className="mb-6">
          <label className="block text-sm font-black text-black mb-2 uppercase">
            Number of Rails
          </label>
          <input
            type="number"
            value={keyValues.rails || 3}
            onChange={(e) => setKeyValues({ ...keyValues, rails: parseInt(e.target.value) || 2 })}
            min="2"
              className="w-full px-4 py-3 border-4 border-black bg-orange-100 text-black font-bold focus:outline-none focus:ring-4 focus:ring-orange-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl"
          />
        </div>
      )}

      {/* Options */}
      <div className="space-y-3 mb-6 p-4 bg-gray-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={options.showMath}
            onChange={(e) => onOptionsChange({ ...options, showMath: e.target.checked })}
            className="w-6 h-6 border-4 border-black bg-white checked:bg-black focus:ring-0"
          />
          <span className="text-sm font-black uppercase">Show math details</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={options.preserveCase}
            onChange={(e) => onOptionsChange({ ...options, preserveCase: e.target.checked })}
            className="w-6 h-6 border-4 border-black bg-white checked:bg-black focus:ring-0"
          />
          <span className="text-sm font-black uppercase">Preserve case</span>
        </label>
      </div>

      {/* Action Button */}
      <button
        onClick={mode === 'encrypt' ? handleEncrypt : handleDecrypt}
        className="w-full py-5 px-6 bg-black text-yellow-300 border-4 border-black font-black uppercase text-lg hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl"
      >
        {mode === 'encrypt' ? (
          <>
            Encrypt Message
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        ) : (
          <>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Decrypt Message
          </>
        )}
      </button>
    </motion.div>
  );
}
