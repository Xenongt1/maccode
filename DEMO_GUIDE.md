# Classical Cipher Visualizer - Demo Guide

## 🚀 Quick Start Demo

### 1. Launch the Application

```bash
npm run dev
```

Open your browser to `http://localhost:3000`

### 2. First Encryption - Caesar Cipher

**Step-by-step walkthrough:**

1. **Select Caesar Cipher** from the left panel (already selected by default)
2. **Click "Load Test"** button to load the example: "HELLO"
3. **Set shift value** to 3 (default)
4. **Click "Encrypt"** button
5. **Watch the animation!**
   - Step 1: Initialize cipher
   - Step 2-6: Encrypt each letter (H→K, E→H, L→O, L→O, O→R)
   - Step 7: Complete

6. **Use animation controls:**
   - Click ▶️ to auto-play
   - Use ← → to step through frames
   - Adjust speed slider for faster/slower playback
   - Press `Space` to play/pause

7. **View the output:** KHOOR

### 3. Try More Ciphers

#### Affine Cipher
1. Select "Affine Cipher"
2. Load test case: "HELLO"
3. Set a=5, b=8
4. Encrypt → Output: RCLLA
5. Watch the math: `(ax + b) mod 26` for each letter

#### Atbash Cipher
1. Select "Atbash Cipher"
2. Load test case: "HELLO"
3. Encrypt → Output: SVOOL
4. Notice: No key needed (reverse alphabet)
5. Try decrypting SVOOL → back to HELLO!

#### Vigenère Cipher
1. Select "Vigenère Cipher"
2. Load test case: "HELLO"
3. Key: "KEY"
4. Encrypt → Output: RIJVS
5. Watch how the key repeats: K-E-Y-K-E

#### Playfair Cipher
1. Select "Playfair Cipher"
2. Load test case: "HELLO"
3. Key: "MONARCHY"
4. Encrypt → Output: CFSUPM
5. **See the 5×5 grid** appear in visualization
6. Watch digraph pairs: HE → LX → LO

#### Rail Fence Cipher
1. Select "Rail Fence Cipher"
2. Load test case: "HELLO"
3. Rails: 3
4. Encrypt → Output: HOELL
5. See the zigzag pattern in the grid visualization

### 4. Explore Features

#### Toggle Math Details
1. Encrypt any cipher
2. Check "Show math details" option
3. See calculations: `H(7) + 3 = 10 mod 26 → K`

#### Frequency Analysis
1. Enter longer text (try a paragraph)
2. Encrypt with Caesar cipher
3. View frequency chart at bottom-left
4. Compare plaintext vs ciphertext letter distribution

#### Export Options
1. Encrypt some text
2. Click the copy icon (📋) to copy output
3. Hover over download icon (⬇️)
4. Choose:
   - "Export Frames (JSON)" - For developers
   - "Export Text File" - For sharing results

#### Keyboard Shortcuts
- `←` Previous step
- `→` Next step  
- `Space` Play/Pause
- Works when not typing in input fields

### 5. Advanced Usage

#### Custom Text
```
Plaintext: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG"
Cipher: Vigenère
Key: "SECRET"
```

1. Enter your custom text
2. Select cipher
3. Configure key
4. Toggle options:
   - ☑️ Preserve case - Keep UPPER/lower
   - ☑️ Keep non-letters - Keep spaces/punctuation
   - ☑️ Show math - Display calculations

#### Decrypt Mode
1. Switch to "Decrypt" tab
2. Enter ciphertext: "KHOOR"
3. Caesar shift: 3
4. Decrypt → "HELLO"

#### Compare Ciphers
Try the same plaintext with different ciphers:

| Plaintext | Cipher | Key | Output |
|-----------|--------|-----|--------|
| HELLO | Caesar | 3 | KHOOR |
| HELLO | Affine | a=5,b=8 | RCLLA |
| HELLO | Vigenère | KEY | RIJVS |
| HELLO | Playfair | MONARCHY | CFSUPM |

### 6. Educational Use Cases

#### For Students
1. **Learn algorithm steps:** Watch frame-by-frame
2. **Understand math:** Enable "Show math details"
3. **Test understanding:** Decrypt known ciphertext
4. **Experiment:** Try different keys and observe patterns

#### For Teachers
1. **Demonstrate in class:** Use projector with auto-play
2. **Create exercises:** Export different examples
3. **Show frequency analysis:** Explain why Caesar is weak
4. **Compare ciphers:** Show evolution from simple to complex

#### For Developers
1. **Study implementation:** View source code
2. **Export frames:** Analyze JSON structure
3. **Run tests:** `npm test` to see test cases
4. **Extend ciphers:** Add new implementations

### 7. Understanding Visualizations

#### Character Highlighting
- **Purple background** = Current character being processed
- **Calculation box** = Shows math operation
- **Progress dots** = One per frame, click to jump

#### Grid Displays
- **Playfair 5×5 grid** shows letter positions
- **Highlighted cells** indicate current digraph
- **Color changes** show transformations

#### Frequency Charts
- **Purple bars** = Plaintext letter frequency
- **Pink bars** = Ciphertext letter frequency
- **Compare patterns** to understand cipher strength

### 8. Pro Tips

#### Efficient Navigation
1. Use keyboard shortcuts for quick stepping
2. Click progress dots to jump to specific frames
3. Adjust speed to 2x or 4x for long texts
4. Use 0.25x speed for detailed learning

#### Testing Ciphers
1. Start with "Load Test" for validated examples
2. Modify one parameter at a time
3. Compare encrypt/decrypt to verify correctness
4. Check frequency analysis for security insights

#### Best Practices
- Short texts (5-20 chars) work best for visualization
- Use "Beginner" verbosity for overview
- Use "Detailed" verbosity for deep learning
- Export JSON to save interesting examples

### 9. Troubleshooting

#### Affine Cipher Error
**Error:** "a must be coprime with 26"
**Solution:** Use a ∈ {1,3,5,7,9,11,15,17,19,21,23,25}

#### Playfair Odd Length
**Behavior:** Auto-pads with 'X'
**Example:** "HELLO" (5 letters) → HE LX LO (6 letters/3 pairs)

#### Animation Not Playing
**Check:**
- Frames exist (encrypt/decrypt first)
- Not at last frame (skip to start)
- Browser tab is active

### 10. Sample Sessions

#### Session 1: Caesar Basics (5 min)
1. Load test "HELLO"
2. Encrypt with shift=3
3. Step through all frames
4. Switch to decrypt mode
5. Decrypt "KHOOR" → "HELLO"

#### Session 2: Comparing Ciphers (10 min)
1. Encrypt "ATTACK AT DAWN" with Caesar
2. Note output and frequency
3. Encrypt same text with Vigenère
4. Compare frequency analysis
5. Understand polyalphabetic advantage

#### Session 3: Playfair Deep Dive (15 min)
1. Load test "HELLO"
2. Watch grid construction
3. Step through each digraph
4. Note rectangle/row/column rules
5. Try custom key and text
6. Export frames for study

## 📱 Mobile Demo

The app is fully responsive! On mobile:
- Cipher selector stacks vertically
- Animation controls remain accessible
- Frequency chart adjusts size
- Touch-friendly buttons and sliders

## 🎓 Educational Value

### What Students Learn:
1. **Algorithm understanding** - See each step
2. **Mathematical concepts** - Modular arithmetic
3. **Pattern recognition** - Frequency analysis
4. **Security awareness** - Why classical ciphers are broken
5. **Historical context** - Evolution of cryptography

### Assessment Ideas:
1. Given plaintext and ciphertext, find the key
2. Identify which cipher was used
3. Explain why frequency analysis works
4. Compare cipher security levels
5. Implement a new cipher (extend the code)

## 🔗 Resources

- **GitHub Repo:** View source code
- **README.md:** Full documentation
- **Test Files:** See test vectors
- **Type Definitions:** Understand data structures

---

**Enjoy exploring classical cryptography! 🔐**

*Remember: These are educational tools. Never use classical ciphers for real security.*
