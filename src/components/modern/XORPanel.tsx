import { useState } from 'react';
import { motion } from 'framer-motion';
import StepPlayer, { CipherStep } from './StepPlayer';

interface Props { activeTab: 'learn' | 'play' }

const H_BITS = '01001000'.split('');
const I_BITS = '01001001'.split('');
const A_BITS = '01000001'.split('');
const B_BITS = '01000010'.split('');
const HA_BITS = H_BITS.map((b, i) => String(parseInt(b) ^ parseInt(A_BITS[i])));
const IB_BITS = I_BITS.map((b, i) => String(parseInt(b) ^ parseInt(B_BITS[i])));

function BitRow({ bits, color, label }: { bits: string[]; color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="w-20 font-black text-xs text-black/70 text-right pr-1">{label}</span>
      {bits.map((b, i) => (
        <span key={i} className={`w-6 h-6 flex items-center justify-center border-2 border-black rounded font-black text-xs ${color}`}>{b}</span>
      ))}
    </div>
  );
}

const XOR_STEPS: CipherStep[] = [
  {
    title: 'Plaintext Bits',
    visual: (
      <div className="space-y-2 w-full">
        <BitRow bits={H_BITS} color="bg-cyan-200" label="H (72)" />
        <BitRow bits={I_BITS} color="bg-cyan-200" label="I (73)" />
      </div>
    ),
    explanation: "Each character is 8 bits. 'H' = 72 and 'I' = 73 in ASCII. Every character you type is stored this way in a computer.",
  },
  {
    title: 'Key Bits',
    visual: (
      <div className="space-y-2 w-full">
        <BitRow bits={A_BITS} color="bg-pink-200" label="A (65)" />
        <BitRow bits={B_BITS} color="bg-pink-200" label="B (66)" />
      </div>
    ),
    explanation: "The key 'AB' is also converted to bits. A=65, B=66. The key repeats cyclically to match the message length.",
  },
  {
    title: 'XOR Each Bit',
    visual: (
      <div className="space-y-2 w-full">
        <BitRow bits={H_BITS} color="bg-cyan-200" label="H" />
        <div className="flex items-center gap-1 pl-[84px]">
          {Array(8).fill('⊕').map((s, i) => <span key={i} className="w-6 text-center font-black text-sm text-black/40">{s}</span>)}
        </div>
        <BitRow bits={A_BITS} color="bg-pink-200" label="A" />
        <div className="flex items-center gap-1 pl-[84px]">
          {Array(8).fill('=').map((s, i) => <span key={i} className="w-6 text-center font-black text-sm text-black/40">{s}</span>)}
        </div>
        <BitRow bits={HA_BITS} color="bg-yellow-300" label="H⊕A" />
      </div>
    ),
    explanation: "XOR outputs 1 only when the two bits differ. The result byte looks like garbage — meaningless without the key.",
  },
  {
    title: 'Ciphertext',
    visual: (
      <div className="flex gap-4 items-center flex-wrap justify-center">
        <div className="bg-black text-green-300 border-4 border-black font-mono font-black text-sm px-4 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          H ⊕ A = chr({parseInt(HA_BITS.join(''), 2)})
        </div>
        <div className="bg-black text-green-300 border-4 border-black font-mono font-black text-sm px-4 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          I ⊕ B = chr({parseInt(IB_BITS.join(''), 2)})
        </div>
        <div className="w-full text-center text-xs font-bold text-black/50 mt-1">↓ transmitted over the network</div>
      </div>
    ),
    explanation: "The ciphertext bytes are unreadable. An eavesdropper intercepting the bytes has no idea what the original text was.",
  },
  {
    title: 'Decrypt (XOR Again)',
    visual: (
      <div className="flex gap-4 items-center flex-wrap justify-center">
        <div className="text-center">
          <div className="text-xs font-bold mb-1">Ciphertext ⊕ Key</div>
          <div className="bg-yellow-100 border-4 border-black font-mono font-black text-sm px-4 py-3 rounded-xl">chr({parseInt(HA_BITS.join(''), 2)}) ⊕ A</div>
        </div>
        <div className="font-black text-2xl">=</div>
        <div className="bg-green-300 border-4 border-black font-black text-3xl px-5 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">H</div>
        <div className="bg-green-300 border-4 border-black font-black text-3xl px-5 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">I</div>
      </div>
    ),
    explanation: "XOR is its own inverse: applying the same key again perfectly recovers the original plaintext. Encryption = decryption.",
  },
];

function xorStrings(a: string, b: string): string {
  const result: string[] = [];
  for (let i = 0; i < a.length; i++) {
    result.push(String.fromCharCode(a.charCodeAt(i) ^ b.charCodeAt(i % b.length)));
  }
  return result.join('');
}

function toBin(s: string): string[] {
  return s.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0'));
}

function toHex(s: string): string {
  return s.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase()).join(' ');
}

export function XORLearn() {
  return (
    <div className="space-y-6">
      <StepPlayer steps={XOR_STEPS} accentColor="bg-green-300" />
      <div className="bg-green-300 border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="text-xl font-black uppercase mb-2">XOR Stream Cipher</h3>
        <p className="font-bold text-sm leading-relaxed">
          XOR (exclusive OR) is the simplest and most powerful primitive in cryptography. A <strong>stream cipher</strong> generates
          a pseudo-random <em>keystream</em> and XORs it with plaintext bit-by-bit. The One-Time Pad (OTP) —
          using a truly random key as long as the message — provides <strong>information-theoretic security</strong>.
        </p>
      </div>

      {/* XOR Truth Table */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
          <h3 className="font-black uppercase mb-3">XOR Truth Table</h3>
          <table className="w-full border-collapse font-mono text-sm font-bold">
            <thead>
              <tr>
                {['A', 'B', 'A ⊕ B'].map(h => (
                  <th key={h} className="border-2 border-black p-2 bg-black text-yellow-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[['0','0','0'],['0','1','1'],['1','0','1'],['1','1','0']].map(([a,b,r],i) => (
                <tr key={i} className={r === '1' ? 'bg-green-100' : 'bg-red-100'}>
                  <td className="border-2 border-black p-2 text-center">{a}</td>
                  <td className="border-2 border-black p-2 text-center">{b}</td>
                  <td className="border-2 border-black p-2 text-center font-black">{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs font-bold mt-2 text-black/60">XOR = 1 only when inputs differ</p>
        </div>

        <div className="bg-yellow-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
          <h3 className="font-black uppercase mb-3">Key Property</h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="bg-white border-2 border-black p-2 rounded-xl">P ⊕ K = C (encrypt)</div>
            <div className="bg-white border-2 border-black p-2 rounded-xl">C ⊕ K = P (decrypt)</div>
            <div className="bg-white border-2 border-black p-2 rounded-xl">P ⊕ P = 0 (same = zero)</div>
            <div className="bg-white border-2 border-black p-2 rounded-xl">P ⊕ 0 = P (zero = identity)</div>
          </div>
          <p className="text-xs font-bold mt-2">Encryption and decryption are <em>identical operations</em>.</p>
        </div>
      </div>

      {/* Bit-level example */}
      <div className="bg-cyan-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Bit-Level Example: 'H' ⊕ 'K'</h3>
        <div className="font-mono text-sm space-y-2">
          {[
            { label: 'H (72)', bits: '01001000', color: 'text-cyan-600' },
            { label: 'K (75)', bits: '01001011', color: 'text-pink-600' },
            { label: 'Result (3)', bits: '00000011', color: 'text-green-600' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-20 font-black text-xs text-black">{r.label}</span>
              <div className="flex gap-1">
                {r.bits.split('').map((b, j) => (
                  <span key={j}
                    className={`w-6 h-6 flex items-center justify-center border-2 border-black rounded font-black
                      ${i === 2 && r.bits[j] === '1' ? 'bg-yellow-300' : 'bg-white'} ${r.color}`}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-time pad */}
      <div className="bg-red-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">The Two-Time Pad Catastrophe</h3>
        <p className="font-bold text-sm mb-3">
          If you reuse the same keystream for two messages, an attacker who intercepts both ciphertexts can XOR them:
        </p>
        <div className="font-mono text-sm space-y-2">
          <div className="bg-white border-2 border-black p-2 rounded-xl">C₁ = P₁ ⊕ K</div>
          <div className="bg-white border-2 border-black p-2 rounded-xl">C₂ = P₂ ⊕ K</div>
          <div className="bg-yellow-300 border-2 border-black p-2 rounded-xl font-black">C₁ ⊕ C₂ = P₁ ⊕ P₂ (key cancels!)</div>
        </div>
        <p className="text-sm font-bold mt-3">
          → The "crib dragging" attack recovers P₁ and P₂ from P₁⊕P₂ using known-plaintext guesses.
          This broke WWII Russian spy communications (Venona project).
        </p>
      </div>

      {/* Modern stream ciphers */}
      <div className="bg-purple-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Modern Stream Ciphers</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm font-bold">
          {[
            { name: 'ChaCha20', use: 'TLS 1.3, WireGuard', note: 'Designed by Bernstein; 256-bit key, 96-bit nonce' },
            { name: 'Salsa20', use: 'eSTREAM portfolio', note: 'Predecessor to ChaCha20; also highly secure' },
            { name: 'RC4', use: 'Deprecated (WEP, SSL)', note: 'Broken by multiple biases; never use' },
            { name: 'AES-CTR', use: 'AES in counter mode', note: 'Turns AES block cipher into a stream cipher' },
          ].map(s => (
            <div key={s.name} className="bg-white border-2 border-black p-3 rounded-xl">
              <div className="font-black">{s.name}</div>
              <div className="text-xs text-black/60">{s.use}</div>
              <div className="text-xs mt-1">{s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function XORPlay() {
  const [text, setText] = useState('Hello, World!');
  const [key, setKey] = useState('SECRET');
  const [showBits, setShowBits] = useState(false);

  const cipher = xorStrings(text, key);
  const decrypted = xorStrings(cipher, key);
  const plainBins = toBin(text.slice(0, 4));
  const keyBins = toBin(key.slice(0, 4).padEnd(4, key[0] || 'K'));
  const cipherBins = toBin(cipher.slice(0, 4));

  return (
    <div className="space-y-5">
      <div className="bg-green-100 border-4 border-black p-4 rounded-xl font-bold text-sm">
        Simple XOR stream cipher. Enter any text and key — same operation encrypts and decrypts.
      </div>

      <div>
        <label className="block font-black uppercase text-sm mb-1">Plaintext</label>
        <textarea rows={3} value={text} onChange={e => setText(e.target.value)}
          className="w-full px-4 py-3 border-4 border-black bg-yellow-100 font-bold focus:outline-none focus:ring-4 focus:ring-green-400 resize-none rounded-xl" />
      </div>

      <div>
        <label className="block font-black uppercase text-sm mb-1">Key (repeats as needed)</label>
        <input value={key} onChange={e => setKey(e.target.value || 'K')}
          className="w-full px-4 py-3 border-4 border-black bg-pink-100 font-bold focus:outline-none focus:ring-4 focus:ring-pink-400 rounded-xl" />
      </div>

      <div>
        <label className="block font-black uppercase text-sm mb-1">Ciphertext (hex)</label>
        <div className="w-full px-4 py-3 border-4 border-black bg-black text-green-300 font-mono text-sm rounded-xl break-all">
          {toHex(cipher)}
        </div>
      </div>

      <div>
        <label className="block font-black uppercase text-sm mb-1">Decrypted (XOR ciphertext with same key)</label>
        <div className={`w-full px-4 py-3 border-4 border-black font-bold rounded-xl ${decrypted === text ? 'bg-green-200' : 'bg-red-200'}`}>
          {decrypted}
        </div>
      </div>

      <button onClick={() => setShowBits(!showBits)}
        className="w-full py-3 bg-cyan-300 border-4 border-black font-black uppercase rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
        {showBits ? 'Hide' : 'Show'} Bit-Level Trace (first 4 chars)
      </button>

      {showBits && (
        <div className="bg-white border-4 border-black p-4 rounded-xl font-mono text-xs space-y-3">
          {[
            { label: 'Plaintext', bins: plainBins, color: 'bg-cyan-100' },
            { label: 'Key', bins: keyBins, color: 'bg-pink-100' },
            { label: 'Cipher ⊕', bins: cipherBins, color: 'bg-yellow-100' },
          ].map(row => (
            <div key={row.label}>
              <div className="font-black text-xs mb-1 uppercase">{row.label}</div>
              <div className="space-y-1">
                {row.bins.map((bin, i) => (
                  <div key={i} className="flex gap-1 items-center">
                    <span className="w-4 text-black/40">{i}</span>
                    {bin.split('').map((b, j) => (
                      <span key={j} className={`w-5 h-5 flex items-center justify-center border border-black rounded ${row.color} font-bold`}>{b}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-red-200 border-4 border-black p-4 rounded-xl font-bold text-sm">
        ⚠ This is a toy XOR demo. Real stream ciphers (ChaCha20, AES-CTR) use a cryptographically secure
        pseudo-random number generator — not a raw repeating key. Never use simple XOR with a short repeating key for real data.
      </div>
    </div>
  );
}

export default function XORPanel({ activeTab }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {activeTab === 'learn' ? <XORLearn /> : <XORPlay />}
    </motion.div>
  );
}
