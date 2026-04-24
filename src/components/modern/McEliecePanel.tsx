import { useState } from 'react';
import { motion } from 'framer-motion';
import StepPlayer, { CipherStep } from './StepPlayer';

const MCELIECE_STEPS: CipherStep[] = [
  {
    title: 'Message to Bits',
    visual: (
      <div className="flex flex-col items-center gap-3">
        <div className="bg-yellow-200 border-4 border-black font-black text-3xl px-6 py-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">HELP</div>
        <div className="font-black text-xl">↓</div>
        <div className="bg-white border-2 border-black px-3 py-2 rounded-xl font-mono text-xs">01001000 01000101 01001100 01010000</div>
        <div className="text-xs font-bold text-black/50">32 bits total</div>
      </div>
    ),
    explanation: "Convert the message to binary. McEliece operates on bit vectors — HELP becomes 32 bits of binary data.",
  },
  {
    title: 'Encode with Goppa Code',
    visual: (
      <div className="flex flex-col items-center gap-2">
        <div className="bg-white border-2 border-black px-3 py-2 rounded-xl font-mono text-xs">01001000 01000101…</div>
        <div className="font-black text-xl">↓</div>
        <div className="bg-purple-300 border-4 border-black px-5 py-4 rounded-xl font-black text-sm text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Generator Matrix G<br/><span className="text-xs font-bold">(public key)</span></div>
        <div className="font-black text-xl">↓</div>
        <div className="flex gap-2 items-center">
          <div className="bg-white border-2 border-black px-2 py-1 rounded font-mono text-xs">01001000…</div>
          <div className="bg-green-300 border-2 border-black px-2 py-1 rounded font-black text-xs">+8 parity bits</div>
        </div>
      </div>
    ),
    explanation: "The message is encoded using the public generator matrix derived from a Goppa error-correcting code, adding redundant parity bits.",
  },
  {
    title: 'Inject t Errors',
    visual: (
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-0.5 flex-wrap justify-center">
          {'01001000010001010100'.split('').map((b, i) => (
            <span key={i} className={`w-5 h-5 flex items-center justify-center border border-black rounded text-xs font-black ${[3,9,15].includes(i) ? 'bg-red-400 text-white' : 'bg-white'}`}>
              {[3,9,15].includes(i) ? (b==='0'?'1':'0') : b}
            </span>
          ))}
        </div>
        <div className="bg-red-300 border-2 border-black px-3 py-1 rounded font-black text-xs">3 errors injected at positions 3, 9, 15</div>
      </div>
    ),
    explanation: "Exactly t random bit errors are injected into the codeword. This is part of encryption — only the private key can remove them.",
  },
  {
    title: 'Goppa Decoder',
    visual: (
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-0.5 flex-wrap justify-center">
          {'01001000010001010100'.split('').map((b, i) => (
            <span key={i} className={`w-5 h-5 flex items-center justify-center border border-black rounded text-xs font-black ${[3,9,15].includes(i) ? 'bg-green-300' : 'bg-white'}`}>{b}</span>
          ))}
        </div>
        <div className="font-black text-xl">↓</div>
        <div className="bg-rose-300 border-4 border-black px-4 py-3 rounded-xl font-black text-sm text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Goppa Decoder<br/><span className="text-xs">(private key only)</span></div>
        <div className="bg-green-200 border-2 border-black px-3 py-1 rounded font-black text-xs">✓ All 3 errors corrected</div>
      </div>
    ),
    explanation: "The private key reveals the Goppa code structure, allowing the decoder to locate and correct all t errors — impossible without the private key.",
  },
  {
    title: 'Recover Message',
    visual: (
      <div className="flex flex-col items-center gap-3">
        <div className="bg-white border-2 border-black px-3 py-2 rounded-xl font-mono text-xs">01001000 01000101 01001100 01010000</div>
        <div className="font-black text-xl">↓ strip parity bits</div>
        <div className="bg-green-300 border-4 border-black font-black text-3xl px-6 py-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">HELP</div>
        <div className="bg-green-400 border-2 border-black px-3 py-1 rounded font-black text-xs">✓ Message recovered</div>
      </div>
    ),
    explanation: "Strip the redundancy bits and convert back to text — HELP is perfectly recovered despite the injected errors. No quantum computer can break this.",
  },
];

interface Props { activeTab: 'learn' | 'play' }

export function McElieceLearn() {
  return (
    <div className="space-y-6">
      <StepPlayer steps={MCELIECE_STEPS} accentColor="bg-rose-300" />
      <div className="bg-rose-300 border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="text-xl font-black uppercase mb-2">McEliece Cryptosystem</h3>
        <p className="font-bold text-sm leading-relaxed">
          Proposed by Robert McEliece in 1978, this is the <strong>oldest post-quantum public-key scheme</strong>.
          It is based on <strong>error-correcting codes</strong> — specifically the NP-hard problem of decoding
          a random linear code. Unlike RSA and ECC, no quantum algorithm (including Shor's) is known to break it.
        </p>
      </div>

      {/* Core Idea */}
      <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-4">Core Idea: Hidden Error-Correcting Code</h3>
        <div className="space-y-3">
          {[
            { title: 'Key Generation', desc: 'Choose a Goppa code G that can correct t errors. Disguise it by scrambling rows (S) and permuting columns (P). Public key = SGP (looks like a random code). Private key = (G, S, P).', color: 'bg-yellow-100' },
            { title: 'Encryption', desc: 'Encode message m using the public generator matrix Gpub = SGP. Then add t random errors: ciphertext = m·Gpub + e (where e has exactly t 1s).', color: 'bg-cyan-100' },
            { title: 'Decryption', desc: 'Apply P⁻¹ to remove the column permutation, use Goppa decoder to correct the t errors (only you can do this — public key looks random), then apply S⁻¹ to recover m.', color: 'bg-pink-100' },
          ].map(s => (
            <div key={s.title} className={`${s.color} border-2 border-black p-3 rounded-xl`}>
              <div className="font-black text-sm mb-1">{s.title}</div>
              <p className="text-xs font-bold leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Error correcting codes */}
      <div className="bg-yellow-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Error-Correcting Codes 101</h3>
        <p className="font-bold text-sm mb-3">
          ECC adds <strong>redundancy</strong> to data so errors can be detected and corrected. Used in CDs, deep-space probes, hard drives, and QR codes.
        </p>
        <div className="grid grid-cols-3 gap-3 text-center font-bold text-sm">
          <div className="bg-green-200 border-2 border-black p-3 rounded-xl">
            <div className="font-black">Hamming</div>
            <div className="text-xs">Correct 1-bit errors</div>
          </div>
          <div className="bg-blue-200 border-2 border-black p-3 rounded-xl">
            <div className="font-black">Reed-Solomon</div>
            <div className="text-xs">Used in QR codes, CDs</div>
          </div>
          <div className="bg-purple-200 border-2 border-black p-3 rounded-xl">
            <div className="font-black">Goppa</div>
            <div className="text-xs">Used in McEliece; very strong</div>
          </div>
        </div>
      </div>

      {/* Key size problem */}
      <div className="bg-red-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">The Key Size Problem</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm font-bold">
            <thead>
              <tr>
                {['Algorithm', 'Public Key Size', 'Security Level'].map(h => (
                  <th key={h} className="border-2 border-black p-2 bg-black text-yellow-300 text-xs text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['RSA-2048', '256 bytes', '112 bits (classical only)'],
                ['P-256 (ECDH)', '64 bytes', '128 bits (classical only)'],
                ['Kyber-768', '1,184 bytes', '≈ 128 bits (quantum-safe)'],
                ['McEliece-8192', '~261 KB', '≈ 128 bits (quantum-safe)'],
              ].map(([alg, size, sec]) => (
                <tr key={alg} className="even:bg-black/5">
                  <td className="border-2 border-black p-2 font-black text-xs">{alg}</td>
                  <td className="border-2 border-black p-2 text-xs">{size}</td>
                  <td className="border-2 border-black p-2 text-xs">{sec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs font-bold mt-2">
          McEliece's giant key size is its main drawback — 261 KB is impractical for TLS handshakes but acceptable for some use cases.
        </p>
      </div>

      {/* Why quantum-safe */}
      <div className="bg-green-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Why Quantum Computers Can't Break McEliece</h3>
        <ul className="space-y-1 text-sm font-bold">
          <li>→ Security is based on <strong>syndrome decoding</strong> — an NP-hard problem</li>
          <li>→ Shor's algorithm only helps with number-theoretic problems (factoring, discrete log)</li>
          <li>→ Grover's algorithm gives only a quadratic speedup — manageable by doubling parameters</li>
          <li>→ No known quantum or classical algorithm breaks generic syndrome decoding efficiently</li>
          <li>→ 46 years of cryptanalysis and it's still standing (most vetted PQ scheme)</li>
        </ul>
      </div>
    </div>
  );
}

function simpleMcElieceDemo(message: string, errorBits: number) {
  const bits = message.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
  const parity = Array.from(bits).reduce((acc, b) => acc ^ parseInt(b), 0);
  const encoded = bits + parity;

  // Inject random errors
  const corrupted = encoded.split('');
  const positions: number[] = [];
  while (positions.length < Math.min(errorBits, Math.floor(encoded.length / 4))) {
    const pos = Math.floor(Math.random() * encoded.length);
    if (!positions.includes(pos)) {
      positions.push(pos);
      corrupted[pos] = corrupted[pos] === '0' ? '1' : '0';
    }
  }

  // "Correct" errors (in real McEliece this uses the Goppa decoder)
  const fixed = [...corrupted];
  for (const p of positions) {
    fixed[p] = fixed[p] === '0' ? '1' : '0';
  }

  const recovered = [];
  for (let i = 0; i < fixed.length - 1; i += 8) {
    const byte = fixed.slice(i, i + 8).join('');
    recovered.push(String.fromCharCode(parseInt(byte, 2)));
  }

  return {
    original: bits.slice(0, 32) + '…',
    errorPositions: positions.slice(0, 5),
    corrupted: corrupted.slice(0, 32).join('') + '…',
    fixed: fixed.slice(0, 32).join('') + '…',
    recovered: recovered.join(''),
    success: recovered.join('') === message,
  };
}

export function McEliecePlay() {
  const [msg, setMsg] = useState('Hello');
  const [errors, setErrors] = useState(2);
  const [result, setResult] = useState<ReturnType<typeof simpleMcElieceDemo> | null>(null);

  const run = () => setResult(simpleMcElieceDemo(msg, errors));

  return (
    <div className="space-y-5">
      <div className="bg-rose-100 border-4 border-black p-4 rounded-xl font-bold text-sm">
        Simplified <strong>error-correcting code demo</strong>. Real McEliece uses Goppa codes with hundreds of kilobytes of key data —
        this demo illustrates the encode → inject errors → correct principle.
      </div>

      <div>
        <label className="block font-black uppercase text-sm mb-1">Message</label>
        <input value={msg} onChange={e => setMsg(e.target.value || 'X')}
          className="w-full px-4 py-3 border-4 border-black bg-yellow-100 font-bold focus:outline-none focus:ring-4 focus:ring-rose-400 rounded-xl" />
      </div>

      <div>
        <label className="block font-black uppercase text-sm mb-1">Errors to inject: {errors}</label>
        <input type="range" min={1} max={5} value={errors} onChange={e => setErrors(Number(e.target.value))}
          className="w-full" />
      </div>

      <button onClick={run}
        className="w-full py-4 bg-rose-400 border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl">
        Encode → Inject Errors → Decode
      </button>

      {result && (
        <div className="space-y-3 font-mono text-xs">
          {[
            { label: 'Original bits (first 32)', val: result.original, color: 'bg-green-100' },
            { label: `Corrupted (errors at positions: ${result.errorPositions.join(', ')})`, val: result.corrupted, color: 'bg-red-100' },
            { label: 'After error correction', val: result.fixed, color: 'bg-cyan-100' },
          ].map(r => (
            <div key={r.label}>
              <div className="font-black text-xs uppercase font-sans mb-1">{r.label}</div>
              <div className={`${r.color} border-2 border-black p-2 rounded-xl break-all`}>{r.val}</div>
            </div>
          ))}
          <div className={`border-4 border-black p-3 rounded-xl font-black text-center text-sm font-sans ${result.success ? 'bg-green-300' : 'bg-red-300'}`}>
            {result.success ? `✓ Recovered: "${result.recovered}"` : `✗ Recovery failed (too many errors for this simplified demo)`}
          </div>
        </div>
      )}
    </div>
  );
}

export default function McEliecePanel({ activeTab }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {activeTab === 'learn' ? <McElieceLearn /> : <McEliecePlay />}
    </motion.div>
  );
}
