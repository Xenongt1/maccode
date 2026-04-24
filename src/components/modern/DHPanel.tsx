import { useState } from 'react';
import { motion } from 'framer-motion';
import StepPlayer, { CipherStep } from './StepPlayer';

const DH_STEPS: CipherStep[] = [
  {
    title: 'Public Parameters',
    visual: (
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="bg-yellow-200 border-4 border-black px-5 py-4 rounded-2xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-black uppercase text-black/60">Prime</div>
          <div className="font-black text-2xl">p = 23</div>
        </div>
        <div className="bg-orange-200 border-4 border-black px-5 py-4 rounded-2xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-black uppercase text-black/60">Generator</div>
          <div className="font-black text-2xl">g = 5</div>
        </div>
        <div className="bg-black text-yellow-300 border-2 border-black px-3 py-1.5 rounded-xl font-black text-xs self-end">Shared publicly</div>
      </div>
    ),
    explanation: "p=23 (prime) and g=5 (generator) are agreed upon and sent over the public channel. Anyone can see them.",
  },
  {
    title: "Alice's Key",
    visual: (
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <div className="bg-cyan-300 border-4 border-black px-4 py-3 rounded-2xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-black">🔒 Secret</div>
          <div className="font-black text-2xl">a = 6</div>
        </div>
        <div className="font-black text-xl">→</div>
        <div className="bg-white border-2 border-black px-3 py-2 rounded-xl font-mono text-xs font-black">5⁶ mod 23</div>
        <div className="font-black text-xl">=</div>
        <div className="bg-cyan-200 border-4 border-black px-5 py-3 rounded-2xl font-black text-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">A = 8</div>
      </div>
    ),
    explanation: "Alice picks secret a=6, computes A=gᵃ mod p=8, and sends A over the public channel. Eve sees A=8 but not a=6.",
  },
  {
    title: "Bob's Key",
    visual: (
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <div className="bg-pink-300 border-4 border-black px-4 py-3 rounded-2xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-black">🔒 Secret</div>
          <div className="font-black text-2xl">b = 15</div>
        </div>
        <div className="font-black text-xl">→</div>
        <div className="bg-white border-2 border-black px-3 py-2 rounded-xl font-mono text-xs font-black">5¹⁵ mod 23</div>
        <div className="font-black text-xl">=</div>
        <div className="bg-pink-200 border-4 border-black px-5 py-3 rounded-2xl font-black text-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">B = 19</div>
      </div>
    ),
    explanation: "Bob picks secret b=15, computes B=gᵇ mod p=19. He sends B to Alice. Eve sees B=19 but cannot recover b.",
  },
  {
    title: 'Shared Secret',
    visual: (
      <div className="space-y-2 w-full max-w-sm mx-auto">
        <div className="bg-cyan-200 border-4 border-black px-4 py-2 rounded-xl font-mono font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          Alice: 19⁶ mod 23 = <strong>2</strong>
        </div>
        <div className="bg-pink-200 border-4 border-black px-4 py-2 rounded-xl font-mono font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          Bob: 8¹⁵ mod 23 = <strong>2</strong>
        </div>
        <div className="bg-green-300 border-4 border-black px-4 py-3 rounded-xl font-black text-lg text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          ✓ Shared secret S = 2
        </div>
      </div>
    ),
    explanation: "Both compute the shared secret independently: Alice gets Bᵃ mod p, Bob gets Aᵇ mod p. Both equal gᵃᵇ mod p — they match!",
  },
  {
    title: "Eve Can't Break It",
    visual: (
      <div className="space-y-2 w-full max-w-sm mx-auto">
        <div className="bg-red-200 border-4 border-black px-4 py-3 rounded-xl font-bold text-sm">
          Eve sees: p=23, g=5, A=8, B=19
        </div>
        <div className="bg-white border-2 border-black px-3 py-2 rounded-xl font-mono text-sm text-center">Must solve: 5^? ≡ 8 (mod 23)</div>
        <div className="bg-red-400 border-4 border-black px-4 py-2 rounded-xl font-black text-sm text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          Discrete Log Problem — Hard!
        </div>
      </div>
    ),
    explanation: "Eve sees all public values but cannot recover a or b. Solving gˣ≡A (mod p) is the Discrete Logarithm Problem — computationally infeasible for large p.",
  },
];

interface Props { activeTab: 'learn' | 'play' }

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = BigInt(1);
  base = base % mod;
  while (exp > BigInt(0)) {
    if (exp % BigInt(2) === BigInt(1)) result = (result * base) % mod;
    exp = exp / BigInt(2);
    base = (base * base) % mod;
  }
  return result;
}

const PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

export function DHLearn() {
  return (
    <div className="space-y-6">
      <StepPlayer steps={DH_STEPS} accentColor="bg-teal-300" />
      <div className="bg-teal-300 border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="text-xl font-black uppercase mb-2">Diffie-Hellman Key Exchange</h3>
        <p className="font-bold text-sm leading-relaxed">
          Published in 1976 by Whitfield Diffie and Martin Hellman, this was the first practical public-key protocol.
          It solves the <strong>key distribution problem</strong>: two parties can establish a shared secret over an
          insecure channel without any prior shared secret. The security rests on the <strong>Discrete Logarithm Problem</strong>.
        </p>
      </div>

      {/* Color mixing analogy */}
      <div className="bg-yellow-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">The Color Mixing Analogy</h3>
        <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold">
          <div className="space-y-2">
            <div className="bg-yellow-400 border-2 border-black p-3 rounded-xl font-black">Public Color<br/>YELLOW</div>
            <div className="text-2xl">+</div>
            <div className="bg-red-400 border-2 border-black p-3 rounded-xl font-black">Alice's Secret<br/>RED</div>
            <div className="text-2xl">↓</div>
            <div className="bg-orange-400 border-2 border-black p-3 rounded-xl font-black">Alice Sends<br/>ORANGE</div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">↔</div>
              <div className="bg-black text-yellow-300 p-2 rounded-xl font-black text-xs">PUBLIC<br/>CHANNEL</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-yellow-400 border-2 border-black p-3 rounded-xl font-black">Public Color<br/>YELLOW</div>
            <div className="text-2xl">+</div>
            <div className="bg-blue-400 border-2 border-black p-3 rounded-xl font-black">Bob's Secret<br/>BLUE</div>
            <div className="text-2xl">↓</div>
            <div className="bg-green-400 border-2 border-black p-3 rounded-xl font-black">Bob Sends<br/>GREEN</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="text-sm font-bold mb-2">Each adds their secret color to the other's mixture:</div>
          <div className="flex justify-center gap-4">
            <div className="bg-orange-400 border-2 border-black p-2 rounded-xl text-xs font-black">Orange + Blue<br/>= BROWN</div>
            <div className="text-2xl">=</div>
            <div className="bg-green-400 border-2 border-black p-2 rounded-xl text-xs font-black">Green + Red<br/>= BROWN</div>
          </div>
          <div className="mt-2 font-black text-sm">Both arrive at the same shared secret!</div>
        </div>
      </div>

      {/* Math */}
      <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-4">The Math (Discrete Logarithm)</h3>
        <div className="space-y-3 font-mono text-sm">
          <div className="bg-gray-100 border-2 border-black p-3 rounded-xl">
            <span className="font-black">Public parameters: </span>prime p, generator g (agreed publicly)
          </div>
          {[
            { who: 'Alice', action: 'picks secret a, sends', formula: 'A = gᵃ mod p' },
            { who: 'Bob', action: 'picks secret b, sends', formula: 'B = gᵇ mod p' },
            { who: 'Alice', action: 'computes shared secret', formula: 'S = Bᵃ mod p = gᵃᵇ mod p' },
            { who: 'Bob', action: 'computes shared secret', formula: 'S = Aᵇ mod p = gᵃᵇ mod p' },
          ].map(r => (
            <div key={r.who + r.formula} className="flex gap-3 items-center">
              <span className={`w-14 font-black text-xs px-2 py-1 rounded ${r.who === 'Alice' ? 'bg-cyan-300' : 'bg-pink-300'} border border-black`}>{r.who}</span>
              <span className="text-xs">{r.action}: </span>
              <code className="bg-yellow-100 border border-black px-2 py-1 rounded text-xs">{r.formula}</code>
            </div>
          ))}
          <div className="bg-green-200 border-2 border-black p-3 rounded-xl font-black">
            Eve sees: g, p, A=gᵃ mod p, B=gᵇ mod p — but recovering a or b requires solving DLP!
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-red-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Security Considerations</h3>
        <ul className="space-y-1 text-sm font-bold">
          <li>→ Small p (as used in demos) is trivially cracked — real DH uses 2048+ bit primes</li>
          <li>→ DH alone provides no authentication — MITM attacks are possible</li>
          <li>→ TLS uses <strong>Ephemeral DH (DHE)</strong> or <strong>ECDHE</strong> for forward secrecy</li>
          <li>→ Shor's algorithm breaks DH on a quantum computer — use Kyber (ML-KEM) instead</li>
        </ul>
      </div>
    </div>
  );
}

export function DHPlay() {
  const [p, setP] = useState(23);
  const [g, setG] = useState(5);
  const [a, setA] = useState(6);
  const [b, setB] = useState(15);

  const pb = BigInt(p), gb = BigInt(g), ab = BigInt(a), bb = BigInt(b);
  const A = modPow(gb, ab, pb);
  const B = modPow(gb, bb, pb);
  const SA = modPow(B, ab, pb);
  const SB = modPow(A, bb, pb);
  const match = SA === SB;

  return (
    <div className="space-y-5">
      <div className="bg-teal-100 border-4 border-black p-4 rounded-xl font-bold text-sm">
        <strong>Toy DH demo</strong> using small numbers (real DH uses 2048-bit primes). All computations are in your browser.
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-black uppercase text-sm mb-1">Prime p</label>
          <select value={p} onChange={e => setP(Number(e.target.value))}
            className="w-full px-4 py-3 border-4 border-black bg-yellow-100 font-bold focus:outline-none focus:ring-4 focus:ring-teal-400 rounded-xl">
            {PRIMES.map(pr => <option key={pr} value={pr}>{pr}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-black uppercase text-sm mb-1">Generator g</label>
          <input type="number" value={g} min={2} max={p - 1}
            onChange={e => setG(Math.max(2, Math.min(p - 1, Number(e.target.value) || 2)))}
            className="w-full px-4 py-3 border-4 border-black bg-yellow-100 font-bold focus:outline-none focus:ring-4 focus:ring-teal-400 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-cyan-100 border-4 border-black p-4 rounded-xl">
          <h3 className="font-black uppercase text-sm mb-3">Alice's Secret</h3>
          <input type="number" value={a} min={1} max={p - 2}
            onChange={e => setA(Math.max(1, Math.min(p - 2, Number(e.target.value) || 1)))}
            className="w-full px-4 py-3 border-4 border-black bg-white font-bold focus:outline-none focus:ring-4 focus:ring-cyan-400 rounded-xl" />
        </div>
        <div className="bg-pink-100 border-4 border-black p-4 rounded-xl">
          <h3 className="font-black uppercase text-sm mb-3">Bob's Secret</h3>
          <input type="number" value={b} min={1} max={p - 2}
            onChange={e => setB(Math.max(1, Math.min(p - 2, Number(e.target.value) || 1)))}
            className="w-full px-4 py-3 border-4 border-black bg-white font-bold focus:outline-none focus:ring-4 focus:ring-pink-400 rounded-xl" />
        </div>
      </div>

      <div className="bg-white border-4 border-black p-4 rounded-xl font-mono text-sm space-y-3">
        <div className="font-black uppercase text-xs mb-2">Step-by-Step Computation</div>
        <div className="bg-gray-100 border-2 border-black p-2 rounded-xl">
          Public: p = {p}, g = {g}
        </div>
        <div className="bg-cyan-100 border-2 border-black p-2 rounded-xl">
          Alice sends: A = {g}^{a} mod {p} = <strong>{String(A)}</strong>
        </div>
        <div className="bg-pink-100 border-2 border-black p-2 rounded-xl">
          Bob sends: B = {g}^{b} mod {p} = <strong>{String(B)}</strong>
        </div>
        <div className="bg-cyan-200 border-2 border-black p-2 rounded-xl">
          Alice's secret: S = B^a mod p = {String(B)}^{a} mod {p} = <strong>{String(SA)}</strong>
        </div>
        <div className="bg-pink-200 border-2 border-black p-2 rounded-xl">
          Bob's secret: S = A^b mod p = {String(A)}^{b} mod {p} = <strong>{String(SB)}</strong>
        </div>
        <div className={`border-4 border-black p-3 rounded-xl font-black text-center ${match ? 'bg-green-300' : 'bg-red-300'}`}>
          {match ? `✓ Shared secret = ${String(SA)}` : '✗ Mismatch (check parameters)'}
        </div>
      </div>

      <div className="bg-yellow-200 border-4 border-black p-4 rounded-xl font-bold text-sm">
        Eve intercepts: p={p}, g={g}, A={String(A)}, B={String(B)} — but needs to find a or b (discrete log) to get {String(SA)}.
        For small numbers like these, it's trivial. For 2048-bit p, it's infeasible.
      </div>
    </div>
  );
}

export default function DHPanel({ activeTab }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {activeTab === 'learn' ? <DHLearn /> : <DHPlay />}
    </motion.div>
  );
}
