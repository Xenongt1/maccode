import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import StepPlayer, { CipherStep } from './StepPlayer';

const CAT_HASH = '3c0a7167b2c66c15a2397f6ba';
const CATX_HASH = 'a7fb2c44d91e8f3b6c552';
function HexDiff({ a, b }: { a: string; b: string }) {
  return (
    <div className="font-mono text-xs break-all">
      {a.split('').map((c, i) => (
        <span key={i} className={c !== b[i] ? 'bg-yellow-300 text-black' : ''}>{c}</span>
      ))}
    </div>
  );
}

const SHA_STEPS: CipherStep[] = [
  {
    title: 'Input → Bits',
    visual: (
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="bg-yellow-200 border-4 border-black font-black text-2xl px-6 py-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">CAT</div>
        <div className="font-black text-xl">↓</div>
        <div className="flex gap-1 flex-wrap justify-center">
          {['01000011','01000001','01010100'].map((b, i) => (
            <div key={i} className="flex gap-0.5">
              {b.split('').map((bit, j) => (
                <span key={j} className={`w-5 h-5 flex items-center justify-center border border-black rounded text-xs font-black ${bit==='1'?'bg-cyan-200':'bg-white'}`}>{bit}</span>
              ))}
            </div>
          ))}
        </div>
        <div className="text-xs font-bold text-black/50">C=0x43, A=0x41, T=0x54</div>
      </div>
    ),
    explanation: "Any input is converted to binary. 'CAT' = 3 bytes = 24 bits. SHA-256 accepts any length — from empty string to gigabytes.",
  },
  {
    title: 'Padding to 512 bits',
    visual: (
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="flex gap-1 flex-wrap justify-center items-center">
          <div className="bg-cyan-200 border-2 border-black px-2 py-1 rounded font-black text-xs">24 data bits</div>
          <div className="bg-yellow-300 border-2 border-black w-5 h-5 flex items-center justify-center font-black text-xs rounded">1</div>
          <div className="bg-gray-100 border-2 border-black px-2 py-1 rounded font-bold text-xs text-black/40">423 zero bits</div>
          <div className="bg-black text-yellow-300 border-2 border-black px-2 py-1 rounded font-black text-xs">64-bit length=24</div>
        </div>
        <div className="bg-purple-200 border-4 border-black px-4 py-1 rounded-xl font-black text-sm">= 512-bit block</div>
      </div>
    ),
    explanation: "SHA-256 pads the message to 512 bits: append a '1' bit, then enough zeros, then the original length as a 64-bit integer.",
  },
  {
    title: '64 Compression Rounds',
    visual: (
      <div className="flex flex-col items-center gap-2">
        <div className="bg-cyan-200 border-2 border-black px-4 py-2 rounded-xl font-bold text-xs text-center">Initial state: H₀…H₇ (256 bits)</div>
        <div className="font-black text-xl">↓</div>
        <div className="bg-purple-300 border-4 border-black px-5 py-4 rounded-xl font-black text-sm text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          64 rounds of<br/>Σ ⊕ Maj ⊕ Ch ⊕ K
        </div>
        <div className="font-black text-xl">↓</div>
        <div className="bg-green-200 border-2 border-black px-4 py-2 rounded-xl font-bold text-xs text-center">New state: H₀…H₇ (256 bits)</div>
        <div className="text-xs font-bold text-black/50">Constants from √prime₂…√prime₁₉</div>
      </div>
    ),
    explanation: "Each 512-bit block runs through 64 rounds, mixing the 256-bit state with message words and round constants. The state grows completely unpredictable.",
  },
  {
    title: 'Avalanche Effect',
    visual: (
      <div className="space-y-2 w-full">
        <div className="flex gap-2 items-center">
          <div className="bg-yellow-100 border-2 border-black px-2 py-1 rounded font-bold text-xs w-14 text-center">CAT</div>
          <div className="flex-1 bg-white border-2 border-black p-1 rounded-xl"><HexDiff a={CAT_HASH} b={CATX_HASH} /></div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-yellow-100 border-2 border-black px-2 py-1 rounded font-bold text-xs w-14 text-center">CAT!</div>
          <div className="flex-1 bg-white border-2 border-black p-1 rounded-xl"><HexDiff a={CATX_HASH} b={CAT_HASH} /></div>
        </div>
        <div className="bg-yellow-300 border-2 border-black px-3 py-1 rounded font-black text-xs text-center">Yellow = different character</div>
      </div>
    ),
    explanation: "One character change flips roughly half the output bits — the avalanche effect. This ensures no two similar inputs produce similar hashes.",
  },
  {
    title: 'One-Way Function',
    visual: (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-200 border-4 border-black px-4 py-3 rounded-xl font-black text-sm">CAT</div>
          <div className="text-green-600 font-black text-xl">→</div>
          <div className="bg-black text-yellow-300 border-4 border-black px-3 py-3 rounded-xl font-black text-xs text-center">SHA<br/>256</div>
          <div className="text-green-600 font-black text-xl">→</div>
          <div className="bg-green-200 border-4 border-black px-2 py-3 rounded-xl font-mono text-xs">3c0a…</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 border-4 border-black px-2 py-3 rounded-xl font-mono text-xs">3c0a…</div>
          <div className="text-red-600 font-black text-xl">→</div>
          <div className="bg-black text-yellow-300 border-4 border-black px-3 py-3 rounded-xl font-black text-xs text-center relative">
            SHA<br/>256
            <span className="absolute inset-0 flex items-center justify-center text-red-400 text-3xl font-black">✗</span>
          </div>
          <div className="text-red-600 font-black text-xl">→</div>
          <div className="bg-red-200 border-4 border-black px-2 py-3 rounded-xl font-black text-xs">???</div>
        </div>
      </div>
    ),
    explanation: "Computing the hash is fast (milliseconds). Reversing it requires trying 2¹²⁸ inputs on average. SHA-256 is a trapdoor — one direction only.",
  },
];

interface Props { activeTab: 'learn' | 'play' }

async function sha256(text: string): Promise<string> {
  const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function diffCount(a: string, b: string): number {
  let count = 0;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) count++;
  }
  return count;
}

export function SHA256Learn() {
  return (
    <div className="space-y-6">
      <StepPlayer steps={SHA_STEPS} accentColor="bg-amber-300" />
      <div className="bg-amber-300 border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="text-xl font-black uppercase mb-2">What is SHA-256?</h3>
        <p className="font-bold text-sm leading-relaxed">
          <strong>SHA-256</strong> (Secure Hash Algorithm 256-bit) is a <strong>cryptographic hash function</strong>
          from the SHA-2 family (NIST, 2001). It takes any input and produces a fixed <strong>256-bit (32-byte) digest</strong>.
          Hash functions are <em>one-way</em> — you cannot reverse a hash to recover the input.
        </p>
      </div>

      {/* Properties */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { name: 'Deterministic', desc: 'Same input always produces the same hash.', icon: '=' },
          { name: 'One-Way', desc: 'Given H(x), it is computationally infeasible to find x.', icon: '→' },
          { name: 'Avalanche Effect', desc: 'Changing one bit in input changes ~50% of output bits.', icon: <Zap size={22} /> },
          { name: 'Collision Resistant', desc: 'Infeasible to find two different inputs with same hash.', icon: '≠' },
        ].map(p => (
          <div key={p.name} className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
            <div className="text-2xl mb-1">{p.icon}</div>
            <div className="font-black uppercase mb-1">{p.name}</div>
            <p className="text-sm font-bold text-black/70">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Compression function */}
      <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">How SHA-256 Works</h3>
        <div className="space-y-3">
          {[
            { step: '1. Padding', desc: 'Message is padded to a multiple of 512 bits (adds a 1, zeros, then original length as 64-bit int)', color: 'bg-yellow-100' },
            { step: '2. Parse blocks', desc: 'Split padded message into 512-bit (16 × 32-bit word) blocks', color: 'bg-cyan-100' },
            { step: '3. Initialize state', desc: '8 × 32-bit hash values (H₀–H₇) set from fractional parts of √prime₁…√prime₈', color: 'bg-pink-100' },
            { step: '4. Compression', desc: '64 rounds per block. Each round mixes message schedule words Wₜ with round constants Kₜ using Σ, σ, Ch, Maj functions', color: 'bg-green-100' },
            { step: '5. Finalize', desc: 'After all blocks, concatenate H₀||H₁||…||H₇ → 256-bit digest', color: 'bg-purple-100' },
          ].map(s => (
            <div key={s.step} className={`${s.color} border-2 border-black p-3 rounded-xl flex gap-3`}>
              <span className="font-black text-sm w-28 shrink-0">{s.step}</span>
              <span className="font-bold text-sm">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SHA Family */}
      <div className="bg-cyan-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">SHA Family</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm font-bold">
            <thead>
              <tr>
                {['Algorithm', 'Output', 'Security', 'Status'].map(h => (
                  <th key={h} className="border-2 border-black p-2 bg-black text-yellow-300 text-xs text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['MD5', '128 bits', 'Broken', 'bg-red-200'],
                ['SHA-1', '160 bits', 'Deprecated', 'bg-orange-200'],
                ['SHA-224', '224 bits', 'Acceptable', 'bg-yellow-100'],
                ['SHA-256', '256 bits', '128 bits', 'bg-green-200'],
                ['SHA-384', '384 bits', '192 bits', 'bg-green-200'],
                ['SHA-512', '512 bits', '256 bits', 'bg-green-200'],
                ['SHA3-256', '256 bits', '128 bits', 'bg-green-200'],
              ].map(([alg, out, sec, color]) => (
                <tr key={alg} className={color}>
                  <td className="border-2 border-black p-2 font-black text-xs">{alg}</td>
                  <td className="border-2 border-black p-2 text-xs">{out}</td>
                  <td className="border-2 border-black p-2 text-xs">{sec}</td>
                  <td className="border-2 border-black p-2 text-xs">
                    {sec === 'Broken' ? '✗ Never use' : sec === 'Deprecated' ? '⚠ Avoid' : '✓ OK'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Uses */}
      <div className="bg-green-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Real-World Uses of SHA-256</h3>
        <ul className="space-y-1 text-sm font-bold">
          <li>→ TLS certificates (digital signatures over certificate data)</li>
          <li>→ Bitcoin proof-of-work (miners find nonce such that SHA-256(SHA-256(header)) starts with n zeros)</li>
          <li>→ Git object IDs (every commit, tree, blob is identified by its SHA hash)</li>
          <li>→ Password storage with bcrypt/PBKDF2 (hash is stored, not the password)</li>
          <li>→ HMAC-SHA-256 for API authentication tokens</li>
        </ul>
      </div>
    </div>
  );
}

export function SHA256Play() {
  const [input, setInput] = useState('Hello, World!');
  const [input2, setInput2] = useState('Hello, World.');
  const [hash1, setHash1] = useState('');
  const [hash2, setHash2] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const [h1, h2] = await Promise.all([sha256(input), sha256(input2)]);
    setHash1(h1);
    setHash2(h2);
    setLoading(false);
  };

  const diff = hash1 && hash2 ? diffCount(hash1, hash2) : 0;
  const pct = hash1 ? Math.round((diff / 64) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="bg-amber-100 border-4 border-black p-4 rounded-xl font-bold text-sm">
        <strong>Real SHA-256</strong> via Web Crypto API. Try the avalanche effect — change one character and see how much the hash changes.
      </div>

      <div>
        <label className="block font-black uppercase text-sm mb-1">Input 1</label>
        <textarea rows={2} value={input} onChange={e => setInput(e.target.value)}
          className="w-full px-4 py-3 border-4 border-black bg-yellow-100 font-bold focus:outline-none focus:ring-4 focus:ring-amber-400 resize-none rounded-xl" />
      </div>

      <div>
        <label className="block font-black uppercase text-sm mb-1">Input 2 (tweak slightly to see avalanche)</label>
        <textarea rows={2} value={input2} onChange={e => setInput2(e.target.value)}
          className="w-full px-4 py-3 border-4 border-black bg-yellow-100 font-bold focus:outline-none focus:ring-4 focus:ring-amber-400 resize-none rounded-xl" />
      </div>

      <button onClick={run} disabled={loading}
        className="w-full py-4 bg-black text-yellow-300 border-4 border-black font-black uppercase text-lg disabled:opacity-40 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl">
        {loading ? 'Hashing…' : 'Compute SHA-256 Hashes'}
      </button>

      {hash1 && (
        <div className="space-y-4">
          {[
            { label: 'Hash 1', hash: hash1, color: 'bg-cyan-100' },
            { label: 'Hash 2', hash: hash2, color: 'bg-pink-100' },
          ].map(({ label, hash, color }) => (
            <div key={label}>
              <div className="font-black uppercase text-sm mb-1">{label}</div>
              <div className={`${color} border-4 border-black p-3 rounded-xl font-mono text-sm break-all`}>
                {hash.split('').map((c, i) => (
                  <span key={i} className={hash1[i] !== hash2[i] ? 'bg-yellow-400 text-black' : ''}>{c}</span>
                ))}
              </div>
            </div>
          ))}

          <div className={`border-4 border-black p-4 rounded-xl font-black text-center ${pct > 40 ? 'bg-green-300' : 'bg-yellow-300'}`}>
            {diff} / 64 hex characters differ = <strong>{pct}%</strong> of the hash changed
            {pct > 40 && ' — Avalanche Effect confirmed!'}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SHA256Panel({ activeTab }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {activeTab === 'learn' ? <SHA256Learn /> : <SHA256Play />}
    </motion.div>
  );
}
