import { useState } from 'react';
import { motion } from 'framer-motion';

async function aesEncrypt(text: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']
  );
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const key = await window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
  );
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const cipherBuf = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(text));
  const combined = new Uint8Array(16 + 12 + cipherBuf.byteLength);
  combined.set(salt, 0); combined.set(iv, 16); combined.set(new Uint8Array(cipherBuf), 28);
  return btoa(String.fromCharCode(...combined));
}

async function aesDecrypt(b64: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const combined = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const salt = combined.slice(0, 16), iv = combined.slice(16, 28), cipherBuf = combined.slice(28);
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']
  );
  const key = await window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
  );
  const plain = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipherBuf);
  return new TextDecoder().decode(plain);
}

interface Props { activeTab: 'learn' | 'play' }

export function AESLearn() {
  return (
    <div className="space-y-6">
      <div className="bg-cyan-300 border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="text-xl font-black uppercase mb-2">What is AES?</h3>
        <p className="font-bold text-sm leading-relaxed">
          The <strong>Advanced Encryption Standard</strong> (AES / Rijndael) is the world's most widely deployed symmetric cipher.
          Designed by Belgian cryptographers and adopted as the US federal standard in 2001, it replaced DES.
          AES operates on a fixed <strong>128-bit block</strong> with key sizes of 128, 192, or 256 bits.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          { op: 'SubBytes', icon: '🔀', desc: 'Each byte is replaced by a non-linear S-box lookup. Prevents algebraic attacks.' },
          { op: 'ShiftRows', icon: '↔️', desc: 'Rows of the 4×4 state matrix are cyclically shifted by 0–3 positions.' },
          { op: 'MixColumns', icon: '✖️', desc: 'Each column is multiplied over GF(2⁸). One byte in → all 4 bytes out change.' },
          { op: 'AddRoundKey', icon: '⊕', desc: 'State is XOR\'d with the round key — the only step that involves the secret key.' },
        ].map(op => (
          <div key={op.op} className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
            <div className="text-2xl mb-1">{op.icon}</div>
            <div className="font-black uppercase mb-1">{op.op}</div>
            <p className="text-sm font-bold text-black/70">{op.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-yellow-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">AES Key Facts</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            ['Block size', '128 bits (fixed)'],
            ['Key sizes', '128 / 192 / 256 bits'],
            ['Rounds', '10 / 12 / 14'],
            ['Structure', 'Substitution-Permutation Network'],
            ['Standard', 'FIPS 197 (2001)'],
            ['Quantum safe?', 'AES-256: effectively yes'],
          ].map(([k, v]) => (
            <div key={k} className="bg-white border-2 border-black p-2 rounded-lg">
              <div className="text-xs font-black uppercase text-black/50">{k}</div>
              <div className="text-sm font-black">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-300 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-2">Security</h3>
        <ul className="space-y-1 text-sm font-bold">
          <li>→ AES-128: 2¹²⁸ keys — brute force takes longer than the age of the universe</li>
          <li>→ AES-256: quantum-resistant (Grover's algorithm only halves effective keyspace to 2¹²⁸)</li>
          <li>→ No practical attack known on full AES</li>
          <li>→ Use AES-GCM mode for authenticated encryption (confidentiality + integrity)</li>
        </ul>
      </div>
    </div>
  );
}

export function AESPlay() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [input, setInput] = useState('Hello, World! This is a secret message.');
  const [password, setPassword] = useState('my-secret-password');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    if (!input.trim() || !password.trim()) return;
    setLoading(true); setError(''); setOutput('');
    try {
      setOutput(mode === 'encrypt' ? await aesEncrypt(input, password) : await aesDecrypt(input.trim(), password));
    } catch {
      setError(mode === 'decrypt' ? 'Decryption failed. Wrong password or corrupted data.' : 'Encryption failed.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="bg-cyan-100 border-4 border-black p-4 rounded-xl font-bold text-sm">
        <strong>Real AES-256-GCM</strong> via Web Crypto API. Password is stretched with PBKDF2 (100k iterations).
        Random salt + IV generated per encryption.
      </div>

      <div className="flex gap-3">
        {(['encrypt', 'decrypt'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`flex-1 py-3 font-black uppercase border-4 border-black rounded-xl transition-all ${mode === m ? (m === 'encrypt' ? 'bg-cyan-400' : 'bg-pink-400') + ' shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-0.5 translate-y-0.5' : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}>
            {m === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </button>
        ))}
      </div>

      <div>
        <label className="block font-black uppercase text-sm mb-1">Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 border-4 border-black bg-yellow-100 font-bold focus:outline-none focus:ring-4 focus:ring-cyan-400 rounded-xl" />
      </div>
      <div>
        <label className="block font-black uppercase text-sm mb-1">{mode === 'encrypt' ? 'Plaintext' : 'Ciphertext (base64)'}</label>
        <textarea rows={4} value={input} onChange={e => setInput(e.target.value)}
          className="w-full px-4 py-3 border-4 border-black bg-yellow-100 font-bold focus:outline-none focus:ring-4 focus:ring-cyan-400 resize-none rounded-xl" />
      </div>

      <button onClick={handle} disabled={loading || !input.trim() || !password.trim()}
        className="w-full py-4 bg-black text-yellow-300 border-4 border-black font-black uppercase text-lg disabled:opacity-40 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl">
        {loading ? 'Processing…' : mode === 'encrypt' ? 'Encrypt with AES-256-GCM' : 'Decrypt'}
      </button>

      {error && <div className="bg-red-300 border-4 border-black p-4 font-bold rounded-xl">{error}</div>}
      {output && (
        <div>
          <label className="block font-black uppercase text-sm mb-1">{mode === 'encrypt' ? 'Ciphertext (base64)' : 'Decrypted plaintext'}</label>
          <textarea rows={4} value={output} readOnly
            className="w-full px-4 py-3 border-4 border-black bg-green-100 font-mono text-sm resize-none rounded-xl" />
          {mode === 'encrypt' && <p className="text-xs font-bold mt-1 text-black/60">Paste into Decrypt tab with same password to reverse.</p>}
        </div>
      )}
    </div>
  );
}

export default function AESPanel({ activeTab }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {activeTab === 'learn' ? <AESLearn /> : <AESPlay />}
    </motion.div>
  );
}
