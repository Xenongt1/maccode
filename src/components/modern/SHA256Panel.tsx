import { useState } from 'react';
import { motion } from 'framer-motion';

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
          { name: 'Avalanche Effect', desc: 'Changing one bit in input changes ~50% of output bits.', icon: '💥' },
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
                    {sec === 'Broken' ? '❌ Never use' : sec === 'Deprecated' ? '⚠ Avoid' : '✓ OK'}
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
