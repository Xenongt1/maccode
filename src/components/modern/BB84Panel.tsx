import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props { activeTab: 'learn' | 'play' }

const RECTILINEAR = '+';
const DIAGONAL = '×';
type Basis = '+' | '×';
type Bit = 0 | 1;

interface Photon { aliceBit: Bit; aliceBasis: Basis; eveBasis?: Basis; eveMeas?: Bit; bobBasis: Basis; bobMeas: Bit; match: boolean }

function runBB84(n: number, evePresent: boolean): Photon[] {
  const photons: Photon[] = [];
  for (let i = 0; i < n; i++) {
    const aliceBit = (Math.random() < 0.5 ? 0 : 1) as Bit;
    const aliceBasis = (Math.random() < 0.5 ? RECTILINEAR : DIAGONAL) as Basis;
    let transmittedBit = aliceBit;

    let eveBasis: Basis | undefined;
    let eveMeas: Bit | undefined;
    if (evePresent) {
      eveBasis = (Math.random() < 0.5 ? RECTILINEAR : DIAGONAL) as Basis;
      if (eveBasis === aliceBasis) {
        eveMeas = aliceBit;
      } else {
        eveMeas = (Math.random() < 0.5 ? 0 : 1) as Bit;
        transmittedBit = eveMeas;
      }
    }

    const bobBasis = (Math.random() < 0.5 ? RECTILINEAR : DIAGONAL) as Basis;
    let bobMeas: Bit;
    if (bobBasis === aliceBasis) {
      bobMeas = transmittedBit;
    } else {
      bobMeas = (Math.random() < 0.5 ? 0 : 1) as Bit;
    }

    photons.push({ aliceBit, aliceBasis, eveBasis, eveMeas, bobBasis, bobMeas, match: aliceBasis === bobBasis });
  }
  return photons;
}

const symbols: Record<string, string> = {
  '+0': '↕', '+1': '↔', '×0': '↗', '×1': '↘'
};

export function BB84Learn() {
  return (
    <div className="space-y-6">
      <div className="bg-sky-300 border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="text-xl font-black uppercase mb-2">BB84 Quantum Key Distribution</h3>
        <p className="font-bold text-sm leading-relaxed">
          Proposed by Charles Bennett and Gilles Brassard in 1984, <strong>BB84</strong> was the first Quantum Key Distribution protocol.
          It allows two parties to share a secret key using quantum mechanics, with <em>provable information-theoretic security</em>.
          Any eavesdropping attempt disturbs the quantum states and is detectable.
        </p>
      </div>

      {/* The 4 states */}
      <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-4">Four Photon States</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { basis: 'Rectilinear (+)', bit0: '↕ Vertical (0)', bit1: '↔ Horizontal (1)', color: 'bg-cyan-100' },
            { basis: 'Diagonal (×)', bit0: '↗ Diagonal (0)', bit1: '↘ Anti-diagonal (1)', color: 'bg-pink-100' },
          ].map(b => (
            <div key={b.basis} className={`${b.color} border-2 border-black p-3 rounded-xl`}>
              <div className="font-black text-sm mb-2">{b.basis}</div>
              <div className="text-2xl">{b.bit0}</div>
              <div className="text-2xl">{b.bit1}</div>
            </div>
          ))}
        </div>
        <p className="text-xs font-bold mt-3 text-black/70">
          If Bob measures with the WRONG basis, he gets a random result — and disturbs the photon.
        </p>
      </div>

      {/* Protocol Steps */}
      <div className="bg-yellow-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Protocol Steps</h3>
        <div className="space-y-3">
          {[
            { n: '1', title: 'Alice sends photons', desc: 'For each bit, Alice randomly picks a basis (+/×) and sends a photon encoding her bit.', color: 'bg-cyan-200' },
            { n: '2', title: 'Bob measures', desc: 'Bob randomly picks a basis for each photon and measures. ~50% of the time he picks the same basis as Alice.', color: 'bg-pink-200' },
            { n: '3', title: 'Basis sifting', desc: 'Alice and Bob compare bases over a public channel. They keep only the bits where both chose the same basis (~50% of bits).', color: 'bg-green-200' },
            { n: '4', title: 'Error check', desc: 'They publicly compare a random subset of sifted bits. If error rate > threshold (~11%), they abort (Eve was listening). Otherwise delete test bits.', color: 'bg-orange-200' },
            { n: '5', title: 'Key distillation', desc: 'Remaining shared bits form the raw key. Privacy amplification (hashing) removes any partial knowledge Eve gained.', color: 'bg-purple-200' },
          ].map(s => (
            <div key={s.n} className={`${s.color} border-2 border-black p-3 rounded-xl flex gap-3`}>
              <span className="font-black text-2xl w-8 shrink-0 text-center">{s.n}</span>
              <div>
                <div className="font-black text-sm">{s.title}</div>
                <p className="text-xs font-bold mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Eve gets caught */}
      <div className="bg-red-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Why Eve Gets Caught (No-Cloning Theorem)</h3>
        <p className="font-bold text-sm mb-3">
          Eve can't copy quantum states (No-Cloning Theorem). When she intercepts and re-sends:
        </p>
        <ul className="space-y-1 text-sm font-bold">
          <li>→ Eve must pick a basis randomly (~50% chance of wrong basis)</li>
          <li>→ Wrong basis → she sends Alice's bit in wrong polarization</li>
          <li>→ Even when Bob uses the same basis as Alice, he gets the wrong bit 25% of the time</li>
          <li>→ Error rate jumps from ~0% to ~25% — Alice and Bob detect this in step 4</li>
        </ul>
      </div>
    </div>
  );
}

export function BB84Play() {
  const [n, setN] = useState(12);
  const [evePresent, setEvePresent] = useState(false);
  const [photons, setPhotons] = useState<Photon[]>([]);
  const [ran, setRan] = useState(false);

  const run = () => {
    setPhotons(runBB84(n, evePresent));
    setRan(true);
  };

  const matched = photons.filter(p => p.match);
  const errors = matched.filter(p => p.aliceBit !== p.bobMeas).length;
  const errorRate = matched.length ? Math.round((errors / matched.length) * 100) : 0;
  const keyBits = matched.filter(p => p.aliceBit === p.bobMeas).map(p => p.aliceBit);

  return (
    <div className="space-y-5">
      <div className="bg-sky-100 border-4 border-black p-4 rounded-xl font-bold text-sm">
        Simulated BB84 protocol. Toggle Eve to see how eavesdropping introduces errors.
        Photon symbols: ↕ = +0, ↔ = +1, ↗ = ×0, ↘ = ×1
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-black uppercase text-sm mb-1">Photons: {n}</label>
          <input type="range" min={6} max={24} step={2} value={n} onChange={e => setN(Number(e.target.value))} className="w-full" />
        </div>
        <div className="flex items-end">
          <button onClick={() => setEvePresent(!evePresent)}
            className={`w-full py-3 border-4 border-black font-black uppercase text-sm rounded-xl transition-all ${evePresent ? 'bg-red-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-0.5 translate-y-0.5' : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
            {evePresent ? 'Eve: ACTIVE' : 'Eve: Off'}
          </button>
        </div>
      </div>

      <button onClick={run}
        className="w-full py-4 bg-sky-400 border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl">
        Run BB84 Simulation
      </button>

      {ran && (
        <div className="space-y-4">
          {/* Photon table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs">
              <thead>
                <tr>
                  {['#', 'Alice Bit', 'Alice Basis', 'Symbol', ...(evePresent ? ['Eve Basis', 'Eve Meas'] : []), 'Bob Basis', 'Bob Meas', 'Keep?'].map(h => (
                    <th key={h} className="border-2 border-black p-1 bg-black text-yellow-300 text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {photons.map((p, i) => (
                  <tr key={i} className={p.match ? (p.aliceBit === p.bobMeas ? 'bg-green-100' : 'bg-red-200') : 'bg-gray-100'}>
                    <td className="border-2 border-black p-1 text-center">{i + 1}</td>
                    <td className="border-2 border-black p-1 text-center">{p.aliceBit}</td>
                    <td className="border-2 border-black p-1 text-center">{p.aliceBasis}</td>
                    <td className="border-2 border-black p-1 text-center text-lg">{symbols[p.aliceBasis + p.aliceBit]}</td>
                    {evePresent && <>
                      <td className="border-2 border-black p-1 text-center text-red-700">{p.eveBasis}</td>
                      <td className="border-2 border-black p-1 text-center text-red-700">{p.eveMeas}</td>
                    </>}
                    <td className="border-2 border-black p-1 text-center">{p.bobBasis}</td>
                    <td className="border-2 border-black p-1 text-center">{p.bobMeas}</td>
                    <td className="border-2 border-black p-1 text-center font-black">
                      {p.match ? (p.aliceBit === p.bobMeas ? '✓' : '✗ERR') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center font-bold">
            <div className="bg-cyan-200 border-2 border-black p-3 rounded-xl">
              <div className="font-black text-xl">{matched.length}</div>
              <div className="text-xs">Sifted bits</div>
            </div>
            <div className={`${errorRate > 15 ? 'bg-red-300' : 'bg-green-200'} border-2 border-black p-3 rounded-xl`}>
              <div className="font-black text-xl">{errorRate}%</div>
              <div className="text-xs">Error rate</div>
            </div>
            <div className="bg-yellow-200 border-2 border-black p-3 rounded-xl">
              <div className="font-black text-xl">{keyBits.length}</div>
              <div className="text-xs">Key bits</div>
            </div>
          </div>

          {keyBits.length > 0 && (
            <div className="bg-green-200 border-4 border-black p-3 rounded-xl font-mono text-sm">
              <span className="font-black uppercase text-xs font-sans mr-2">Shared key:</span>
              {keyBits.join('')}
            </div>
          )}

          {errorRate > 15 && (
            <div className="bg-red-300 border-4 border-black p-4 rounded-xl font-black text-sm text-center">
              ⚠ Error rate {errorRate}% &gt; 11% threshold — Eve detected! Abort and retry.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BB84Panel({ activeTab }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {activeTab === 'learn' ? <BB84Learn /> : <BB84Play />}
    </motion.div>
  );
}
