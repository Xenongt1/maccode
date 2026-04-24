import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AESPanel from './modern/AESPanel';
import DESPanel from './modern/DESPanel';
import TripleDESPanel from './modern/TripleDESPanel';
import XORPanel from './modern/XORPanel';
import RSAPanel from './modern/RSAPanel';
import DHPanel from './modern/DHPanel';
import ECDHPanel from './modern/ECDHPanel';
import SHA256Panel from './modern/SHA256Panel';
import McEliecePanel from './modern/McEliecePanel';
import KyberPanel from './modern/KyberPanel';
import BB84Panel from './modern/BB84Panel';
import EnigmaPanel from './modern/EnigmaPanel';
import { Menu, X } from 'lucide-react';

type CipherId =
  | 'aes' | 'des' | '3des' | 'xor'
  | 'rsa' | 'dh' | 'ecdh'
  | 'sha256'
  | 'mceliece' | 'kyber'
  | 'bb84' | 'enigma';

interface CipherEntry {
  id: CipherId;
  name: string;
  short: string;
}

interface Category {
  label: string;
  color: string;
  dot: string;
  items: CipherEntry[];
}

const CATEGORIES: Category[] = [
  {
    label: 'Symmetric',
    color: 'bg-orange-300',
    dot: 'bg-orange-400',
    items: [
      { id: 'aes', name: 'AES-256-GCM', short: 'Advanced Encryption Standard' },
      { id: 'des', name: 'DES', short: 'Data Encryption Standard' },
      { id: '3des', name: '3DES / TDEA', short: 'Triple DES' },
      { id: 'xor', name: 'XOR Stream Cipher', short: 'Bit-level stream cipher' },
    ],
  },
  {
    label: 'Asymmetric',
    color: 'bg-purple-300',
    dot: 'bg-purple-400',
    items: [
      { id: 'rsa', name: 'RSA-2048-OAEP', short: 'Integer factorization' },
      { id: 'dh', name: 'Diffie-Hellman', short: 'Discrete logarithm' },
      { id: 'ecdh', name: 'ECDH P-256', short: 'Elliptic curve key exchange' },
    ],
  },
  {
    label: 'Hash Functions',
    color: 'bg-amber-300',
    dot: 'bg-amber-400',
    items: [
      { id: 'sha256', name: 'SHA-256', short: 'Secure Hash Algorithm' },
    ],
  },
  {
    label: 'Post-Quantum',
    color: 'bg-rose-300',
    dot: 'bg-rose-400',
    items: [
      { id: 'mceliece', name: 'McEliece', short: 'Error-correcting codes' },
      { id: 'kyber', name: 'ML-KEM (Kyber)', short: 'Lattice-based KEM' },
    ],
  },
  {
    label: 'Quantum & Historical',
    color: 'bg-sky-300',
    dot: 'bg-sky-400',
    items: [
      { id: 'bb84', name: 'BB84 QKD', short: 'Quantum key distribution' },
      { id: 'enigma', name: 'Enigma Machine', short: 'WWII rotor cipher' },
    ],
  },
];

const ALL_ITEMS: CipherEntry[] = CATEGORIES.flatMap(c => c.items);

function renderPanel(id: CipherId, tab: 'learn' | 'play') {
  switch (id) {
    case 'aes': return <AESPanel activeTab={tab} />;
    case 'des': return <DESPanel activeTab={tab} />;
    case '3des': return <TripleDESPanel activeTab={tab} />;
    case 'xor': return <XORPanel activeTab={tab} />;
    case 'rsa': return <RSAPanel activeTab={tab} />;
    case 'dh': return <DHPanel activeTab={tab} />;
    case 'ecdh': return <ECDHPanel activeTab={tab} />;
    case 'sha256': return <SHA256Panel activeTab={tab} />;
    case 'mceliece': return <McEliecePanel activeTab={tab} />;
    case 'kyber': return <KyberPanel activeTab={tab} />;
    case 'bb84': return <BB84Panel activeTab={tab} />;
    case 'enigma': return <EnigmaPanel activeTab={tab} />;
    default: return null;
  }
}

function getCategoryColor(id: CipherId): string {
  for (const cat of CATEGORIES) {
    if (cat.items.some(item => item.id === id)) return cat.color;
  }
  return 'bg-yellow-300';
}

export default function ModernSection() {
  const [selected, setSelected] = useState<CipherId>('aes');
  const [tab, setTab] = useState<'learn' | 'play'>('learn');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const current = ALL_ITEMS.find(i => i.id === selected)!;
  const accentColor = getCategoryColor(selected);

  const Sidebar = () => (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden h-fit">
      <div className="bg-black text-yellow-300 p-4">
        <h2 className="font-black uppercase text-lg">Modern Crypto</h2>
        <p className="text-xs font-bold text-yellow-300/70 mt-1">12 schemes across 5 categories</p>
      </div>
      <div className="p-3 space-y-4">
        {CATEGORIES.map(cat => (
          <div key={cat.label}>
            <div className={`${cat.color} border-2 border-black px-3 py-1 rounded-lg font-black uppercase text-xs mb-2`}>
              {cat.label}
            </div>
            <div className="space-y-1 pl-1">
              {cat.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setSelected(item.id); setSidebarOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl border-2 transition-all font-bold text-sm
                    ${selected === item.id
                      ? `${cat.color} border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-0.5 translate-y-0.5`
                      : 'bg-white border-transparent hover:border-black hover:bg-gray-50'
                    }`}
                >
                  <div className="font-black text-xs">{item.name}</div>
                  <div className="text-xs text-black/60 font-bold">{item.short}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-72 shrink-0">
          <Sidebar />
        </div>

        {/* Mobile sidebar toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-black text-yellow-300 border-4 border-black font-black uppercase text-sm rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            {sidebarOpen ? 'Close' : 'Choose Cipher'}
          </button>

          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <Sidebar />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className={`${accentColor} border-4 border-black p-4 sm:p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl mb-5`}>
            <h2 className="text-2xl sm:text-3xl font-black uppercase">{current.name}</h2>
            <p className="font-bold text-sm mt-1">{current.short}</p>
          </div>

          {/* Learn / Play Toggle */}
          <div className="flex gap-3 mb-5">
            {(['learn', 'play'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 sm:py-4 px-4 font-black uppercase border-4 border-black transition-all rounded-xl text-sm sm:text-base ${
                  tab === t
                    ? `${accentColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-0.5 translate-y-0.5`
                    : 'bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {t === 'learn' ? 'Learn' : 'Play'}
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected + tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                {renderPanel(selected, tab)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
