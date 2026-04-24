import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props { activeTab: 'learn' | 'play' }

export function KyberLearn() {
  return (
    <div className="space-y-6">
      <div className="bg-violet-300 border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="text-xl font-black uppercase mb-2">CRYSTALS-Kyber (ML-KEM)</h3>
        <p className="font-bold text-sm leading-relaxed">
          <strong>CRYSTALS-Kyber</strong>, standardized as <strong>ML-KEM (FIPS 203)</strong> in August 2024, is NIST's
          primary post-quantum Key Encapsulation Mechanism (KEM). It is based on the <strong>Module Learning with Errors (MLWE)</strong>
          problem — believed to be hard for both classical and quantum computers.
          Already deployed in Chrome, Firefox, and Cloudflare for TLS 1.3.
        </p>
      </div>

      {/* LWE problem */}
      <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">The Learning With Errors (LWE) Problem</h3>
        <p className="font-bold text-sm mb-3">
          Given a matrix <strong>A</strong>, vector <strong>s</strong> (secret), and small noise <strong>e</strong>:
        </p>
        <div className="font-mono text-sm space-y-2">
          <div className="bg-yellow-100 border-2 border-black p-2 rounded-xl">b = A·s + e (mod q)</div>
          <div className="text-xs font-bold text-black/60">
            Easy: given A, s, e → compute b<br/>
            Hard: given A, b → find s (even with quantum computers)
          </div>
        </div>
        <div className="mt-4 space-y-2 text-xs font-bold">
          <div className="bg-cyan-100 border-2 border-black p-2 rounded-xl">
            Unlike RSA/ECDH (solve one equation) → you'd need to solve a lattice of n simultaneous noisy equations
          </div>
          <div className="bg-pink-100 border-2 border-black p-2 rounded-xl">
            Best known quantum attack (BKZ algorithm) gives only sub-exponential speedup — manageable by choosing larger parameters
          </div>
        </div>
      </div>

      {/* Lattice visualization */}
      <div className="bg-violet-100 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Lattice Intuition</h3>
        <svg viewBox="0 0 200 160" className="w-full max-w-xs mx-auto border-2 border-black rounded-xl bg-white" style={{ height: 140 }}>
          {/* Grid lines */}
          {[-1,0,1,2,3].map(i =>
            [-1,0,1,2,3].map(j => (
              <g key={`${i}-${j}`}>
                <line x1={20 + i*40} y1={20 + j*35} x2={20 + (i+1)*40} y2={20 + j*35} stroke="#e0e0e0" strokeWidth="1" />
                <line x1={20 + i*40} y1={20 + j*35} x2={20 + i*40} y2={20 + (j+1)*35} stroke="#e0e0e0" strokeWidth="1" />
                <circle cx={20 + i*40} cy={20 + j*35} r="3" fill="#a78bfa" stroke="black" strokeWidth="1" />
              </g>
            ))
          )}
          {/* Noisy point */}
          <circle cx={63} cy={57} r="5" fill="#f59e0b" stroke="black" strokeWidth="2" />
          <text x="70" y="55" fontSize="9" fontWeight="bold" fill="black">b = As+e</text>
          {/* Nearest lattice point */}
          <circle cx={60} cy={55} r="4" fill="#22c55e" stroke="black" strokeWidth="1.5" />
          <text x="67" y="68" fontSize="8" fill="#22c55e" fontWeight="bold">nearest = As</text>
        </svg>
        <p className="text-xs font-bold text-center mt-2 text-black/60">
          Finding the nearest lattice point to a noisy vector — the CVP / LWE problem
        </p>
      </div>

      {/* Kyber KEM */}
      <div className="bg-yellow-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Kyber KEM vs Key Agreement</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm font-bold">
          <div className="bg-white border-2 border-black p-3 rounded-xl">
            <div className="font-black uppercase mb-1">Key Agreement (DH/ECDH)</div>
            <div>Both sides contribute randomness. Result: shared secret. Used in: TLS, Signal.</div>
          </div>
          <div className="bg-white border-2 border-black p-3 rounded-xl">
            <div className="font-black uppercase mb-1">KEM (Kyber)</div>
            <div>Sender generates key + encapsulates it. Receiver decapsulates. Result: shared key. Used in: post-quantum TLS.</div>
          </div>
        </div>
      </div>

      {/* Parameter Sets */}
      <div className="bg-green-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">ML-KEM Parameter Sets (FIPS 203)</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm font-bold">
            <thead>
              <tr>
                {['Variant', 'Security', 'Public Key', 'Ciphertext', 'Shared Key'].map(h => (
                  <th key={h} className="border-2 border-black p-2 bg-black text-yellow-300 text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['ML-KEM-512', 'Category 1 (~AES-128)', '800 B', '768 B', '32 B'],
                ['ML-KEM-768', 'Category 3 (~AES-192)', '1,184 B', '1,088 B', '32 B'],
                ['ML-KEM-1024', 'Category 5 (~AES-256)', '1,568 B', '1,568 B', '32 B'],
              ].map(row => (
                <tr key={row[0]} className="even:bg-black/5">
                  {row.map((cell, i) => (
                    <td key={i} className="border-2 border-black p-2 text-xs">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deployment */}
      <div className="bg-cyan-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Deployment Status</h3>
        <ul className="space-y-1 text-sm font-bold">
          <li>→ NIST ML-KEM (FIPS 203) published August 2024</li>
          <li>→ Chrome 116+ supports X25519Kyber768 hybrid for TLS 1.3</li>
          <li>→ Cloudflare deployed Kyber for all HTTPS connections (2023)</li>
          <li>→ Apple, Google, Signal planning or already using PQC</li>
          <li>→ "Harvest now, decrypt later" attacks make migration urgent: adversaries record TLS today to decrypt when quantum computers arrive</li>
        </ul>
      </div>
    </div>
  );
}

function lweDemo(n: number, q: number) {
  const s = Array.from({ length: n }, () => Math.floor(Math.random() * 3) - 1);
  const rows = Array.from({ length: n + 2 }, () => {
    const a = Array.from({ length: n }, () => Math.floor(Math.random() * q));
    const e = Math.floor(Math.random() * 3) - 1;
    const b = ((a.reduce((sum, ai, i) => sum + ai * s[i], 0) + e) % q + q) % q;
    return { a, e, b };
  });
  return { s, rows, q };
}

export function KyberPlay() {
  const [n, setN] = useState(3);
  const [q, setQ] = useState(17);
  const [data, setData] = useState<ReturnType<typeof lweDemo> | null>(null);

  const run = () => setData(lweDemo(n, q));

  return (
    <div className="space-y-5">
      <div className="bg-violet-100 border-4 border-black p-4 rounded-xl font-bold text-sm">
        <strong>LWE toy demo</strong> — illustrates how noisy linear equations hide the secret vector.
        Real Kyber uses n=256 and q=3329 with polynomial ring arithmetic.
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-black uppercase text-sm mb-1">Dimension n: {n}</label>
          <input type="range" min={2} max={5} value={n} onChange={e => setN(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <label className="block font-black uppercase text-sm mb-1">Modulus q: {q}</label>
          <input type="range" min={7} max={31} step={2} value={q} onChange={e => setQ(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      <button onClick={run}
        className="w-full py-4 bg-violet-400 border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl">
        Generate LWE Instance
      </button>

      {data && (
        <div className="space-y-4">
          <div className="bg-green-200 border-4 border-black p-3 rounded-xl font-mono text-sm">
            <span className="font-black uppercase text-xs font-sans">Secret s (hidden): </span>
            [{data.s.join(', ')}]
          </div>

          <div>
            <div className="font-black uppercase text-sm mb-2">Public equations b = A·s + e (mod {data.q})</div>
            <div className="space-y-2">
              {data.rows.map((row, i) => (
                <div key={i} className="bg-white border-2 border-black p-2 rounded-xl font-mono text-xs flex gap-2 flex-wrap items-center">
                  <span className="text-black/60">b={row.b}</span>
                  <span>=</span>
                  <span>[{row.a.join(',')}]·s</span>
                  <span className={`${row.e !== 0 ? 'text-red-600 font-black' : 'text-black/40'}`}>
                    {row.e >= 0 ? '+' : ''}{row.e} (noise)
                  </span>
                  <span>mod {data.q}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-200 border-4 border-black p-3 rounded-xl font-bold text-sm">
            An attacker sees the equations (A, b) but NOT s or the errors.
            Solving for s requires finding the closest lattice point — hard even for n=3 when noise is present!
          </div>
        </div>
      )}
    </div>
  );
}

export default function KyberPanel({ activeTab }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {activeTab === 'learn' ? <KyberLearn /> : <KyberPlay />}
    </motion.div>
  );
}
