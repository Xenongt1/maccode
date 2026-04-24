# Classical Cipher Step-By-Step Visualizer

An interactive web application that visually demonstrates, step-by-step, how classical ciphers work. Built with React, TypeScript, and Tailwind CSS.

![Classical Cipher Visualizer](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Tests](https://img.shields.io/badge/tests-passing-green)

## 🎯 Features

### Implemented Ciphers

1. **Caesar Cipher** - Simple shift cipher with circular wheel visualization
2. **Affine Cipher** - Linear transformation with ax+b formula
3. **Atbash Cipher** - Reverse alphabet substitution
4. **Vigenère Cipher** - Polyalphabetic substitution with repeating key
5. **Playfair Cipher** - 5×5 grid digraph encryption with visual grid
6. **Rail Fence Cipher** - Transposition zigzag pattern

### Core Features

- **Step-by-Step Visualization**: Watch each encryption/decryption operation unfold frame by frame
- **Animation Controls**: Play/Pause, step forward/backward, adjust speed (0.25x - 4x)
- **Frequency Analysis**: Live chart comparing plaintext vs ciphertext letter frequencies
- **Math Details**: Toggle to show/hide mathematical calculations for each step
- **Test Cases**: Built-in test vectors for each cipher
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Keyboard controls and ARIA labels for screen readers

### Visualization Model

Every cipher operation produces a **Frame** object:

```typescript
interface Frame {
  id: string;
  label: string;
  operationType: string;
  highlightIndices: number[];
  intermediateText: string;
  meta?: {
    calculation?: string;
    grid?: string[][];
    matrix?: number[][];
    position?: { x: number; y: number };
  };
}
```

### Options

- **Preserve Case**: Maintain original letter casing
- **Keep Non-Letters**: Preserve spaces and punctuation
- **Map J→I**: Playfair option to map J to I
- **Padding Character**: Character used for padding (default 'X')
- **Verbosity**: Beginner (fewer frames) or Detailed (all steps)
- **Show Math**: Display mathematical operations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Usage

1. **Select a Cipher** from the left panel
2. **Enter plaintext** or load a test case
3. **Configure key(s)** specific to the cipher
4. **Click Encrypt/Decrypt** to generate visualization
5. **Use animation controls** to step through the process
6. **View frequency analysis** to understand the cipher's effectiveness

## 📚 Cipher Algorithms

### Caesar Cipher

- **Mapping**: A=0...Z=25
- **Encryption**: `E(x) = (x + shift) mod 26`
- **Decryption**: `D(x) = (x - shift) mod 26`
- **Example**: HELLO + shift(3) → KHOOR

### Affine Cipher

- **Encryption**: `E(x) = (ax + b) mod 26`
- **Decryption**: `D(y) = a⁻¹(y - b) mod 26`
- **Constraint**: `gcd(a, 26) = 1`
- **Example**: HELLO + a(5),b(8) → RCLLA

### Atbash Cipher

- **Mapping**: `E(x) = 25 - x`
- **Self-inverse**: Encryption = Decryption
- **Example**: HELLO → SVOOL

### Vigenère Cipher

- **Encryption**: `E(x,k) = (x + k) mod 26`
- **Key repeats**: Polyalphabetic substitution
- **Example**: HELLO + KEY → RIJVS

### Playfair Cipher

1. Create 5×5 grid from key
2. Pair letters into digraphs
3. Apply rules:
   - Same row: shift right
   - Same column: shift down
   - Rectangle: swap columns
- **Example**: HELLO + MONARCHY → CFSUPM

### Rail Fence Cipher

1. Write text in zigzag pattern across N rails
2. Read rails sequentially top to bottom
- **Example**: HELLO + 3 rails → HOELL

## 🧪 Testing

The project includes comprehensive unit tests for all ciphers:

```bash
npm test
```

Test coverage includes:
- ✅ Encryption/Decryption correctness
- ✅ Frame generation
- ✅ Key validation
- ✅ Edge cases
- ✅ Options handling

### Sample Test Vectors

| Cipher | Plaintext | Key | Expected Output |
|--------|-----------|-----|-----------------|
| Caesar | HELLO | 3 | KHOOR |
| Affine | HELLO | a=5, b=8 | RCLLA |
| Atbash | HELLO | - | SVOOL |
| Vigenère | HELLO | KEY | RIJVS |
| Playfair | HELLO | MONARCHY | CFSUPM |
| Rail Fence | HELLO | 3 | HOELL |

## 🎨 Design

The UI is inspired by modern educational platforms with:
- **Gradient backgrounds**: Purple and pink tones
- **Card-based layout**: Clean, organized sections
- **Smooth animations**: Framer Motion powered transitions
- **Dark mode support**: Automatic theme detection
- **Accessible colors**: WCAG compliant contrast ratios

## 🔒 Security Warning

**⚠️ Educational purposes only.** Classical ciphers are not secure for real-world use. They are easily broken with frequency analysis and modern cryptanalysis techniques. Never use them to protect sensitive information.

## 🏗️ Project Structure

```
/workspace
├── src/
│   ├── ciphers/          # Cipher implementations
│   │   ├── caesar.ts
│   │   ├── affine.ts
│   │   ├── atbash.ts
│   │   ├── vigenere.ts
│   │   ├── playfair.ts
│   │   └── railfence.ts
│   ├── components/       # React components
│   │   ├── CipherSelector.tsx
│   │   ├── CipherInput.tsx
│   │   ├── FrameVisualization.tsx
│   │   ├── AnimationControls.tsx
│   │   └── FrequencyAnalysis.tsx
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Helper functions
│   ├── __tests__/       # Test files
│   └── App.tsx          # Main application
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 📝 Frame Generation Algorithm

Each cipher follows this pattern:

1. **Initialization**: Create init frame with cipher setup
2. **Character Processing**: For each character:
   - Create frame showing the operation
   - Include highlight indices
   - Add meta information (calculation, grid, etc.)
3. **Completion**: Create final frame with complete output

Example Caesar cipher frame:

```typescript
{
  id: 'char-0',
  label: "Encrypt 'H' → 'K'",
  operationType: 'encrypt',
  highlightIndices: [0],
  intermediateText: 'K',
  meta: {
    calculation: 'H → 7 → (7 + 3) mod 26 = 10 → K'
  }
}
```

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript 5
- **Styling**: Tailwind CSS 3
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Testing**: Vitest

## 📈 Future Enhancements

Additional ciphers to implement:
- Beaufort Cipher
- Autokey Cipher
- Hill Cipher (with matrix visualization)
- One-Time Pad (OTP)
- Columnar Transposition
- Scytale
- ADFGX/ADFGVX
- Bacon's Cipher
- Homophonic Substitution

Additional features:
- Export animation as GIF/WebM
- Teacher mode with auto-generated exercises
- Cryptanalysis tools
- Historical context for each cipher
- Multi-language support

## 📄 License

This project is for educational purposes. Feel free to use and modify.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ for cryptography education**
