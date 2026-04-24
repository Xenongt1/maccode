import { Frame, CipherOptions, CipherResult, CharacterData } from '../types';
import { charToNum, numToChar, mod, modInverse, gcd, normalizeText } from '../utils/helpers';

export const affineEncrypt = (
  plaintext: string,
  a: number,
  b: number,
  options: CipherOptions
): CipherResult => {
  const frames: Frame[] = [];
  const characters: CharacterData[] = [];
  
  // Validate that a is coprime with 26
  if (gcd(a, 26) !== 1) {
    frames.push({
      id: 'error',
      label: 'Invalid Key',
      operationType: 'error',
      highlightIndices: [],
      intermediateText: '',
      meta: {
        calculation: `Error: 'a' (${a}) must be coprime with 26. GCD(${a}, 26) = ${gcd(a, 26)}`
      }
    });
    
    return { output: '', frames, characters };
  }
  
  const normalized = normalizeText(plaintext, {
    keepNonLetters: options.keepNonLetters,
    toUpper: !options.preserveCase
  });
  
  frames.push({
    id: 'init',
    label: 'Initialize Affine Cipher',
    operationType: 'init',
    highlightIndices: [],
    intermediateText: normalized,
    meta: {
      calculation: `Using formula: E(x) = (${a}x + ${b}) mod 26`
    }
  });
  
  let result = '';
  
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    
    if (!/[A-Z]/i.test(char)) {
      result += char;
      characters.push({
        origChar: char,
        normalizedChar: char,
        index: i,
        stepHistory: [{ step: 0, value: char, operation: 'Non-letter preserved' }]
      });
      continue;
    }
    
    const isUpper = char === char.toUpperCase();
    const x = charToNum(char);
    const encrypted = mod(a * x + b, 26);
    const encryptedChar = numToChar(encrypted);
    const finalChar = (options.preserveCase && !isUpper) 
      ? encryptedChar.toLowerCase() 
      : encryptedChar;
    
    result += finalChar;
    
    characters.push({
      origChar: char,
      normalizedChar: char.toUpperCase(),
      index: i,
      stepHistory: [
        { step: 0, value: char, operation: 'Original' },
        { step: 1, value: x.toString(), operation: 'Convert to number' },
        { step: 2, value: encrypted.toString(), operation: `Apply formula (${a}×${x} + ${b}) mod 26` },
        { step: 3, value: finalChar, operation: 'Convert back to letter' }
      ]
    });
    
    frames.push({
      id: `char-${i}`,
      label: `Encrypt '${char}' → '${finalChar}'`,
      operationType: 'encrypt',
      highlightIndices: [i],
      intermediateText: result,
      meta: {
        calculation: options.showMath 
          ? `${char} → ${x} → (${a}×${x} + ${b}) mod 26 = ${encrypted} → ${finalChar}`
          : `${char} → ${finalChar}`
      }
    });
  }
  
  frames.push({
    id: 'complete',
    label: 'Encryption Complete',
    operationType: 'complete',
    highlightIndices: [],
    intermediateText: result,
    meta: { calculation: `Final ciphertext: ${result}` }
  });
  
  return { output: result, frames, characters };
};

export const affineDecrypt = (
  ciphertext: string,
  a: number,
  b: number,
  options: CipherOptions
): CipherResult => {
  const frames: Frame[] = [];
  const characters: CharacterData[] = [];
  
  if (gcd(a, 26) !== 1) {
    frames.push({
      id: 'error',
      label: 'Invalid Key',
      operationType: 'error',
      highlightIndices: [],
      intermediateText: '',
      meta: {
        calculation: `Error: 'a' (${a}) must be coprime with 26`
      }
    });
    return { output: '', frames, characters };
  }
  
  const aInv = modInverse(a, 26);
  
  frames.push({
    id: 'init',
    label: 'Initialize Affine Decryption',
    operationType: 'init',
    highlightIndices: [],
    intermediateText: ciphertext,
    meta: {
      calculation: `Using formula: D(y) = ${aInv}(y - ${b}) mod 26, where ${aInv} is the inverse of ${a}`
    }
  });
  
  const normalized = normalizeText(ciphertext, {
    keepNonLetters: options.keepNonLetters,
    toUpper: !options.preserveCase
  });
  
  let result = '';
  
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    
    if (!/[A-Z]/i.test(char)) {
      result += char;
      continue;
    }
    
    const isUpper = char === char.toUpperCase();
    const y = charToNum(char);
    const decrypted = mod(aInv * (y - b), 26);
    const decryptedChar = numToChar(decrypted);
    const finalChar = (options.preserveCase && !isUpper) 
      ? decryptedChar.toLowerCase() 
      : decryptedChar;
    
    result += finalChar;
    
    frames.push({
      id: `char-${i}`,
      label: `Decrypt '${char}' → '${finalChar}'`,
      operationType: 'decrypt',
      highlightIndices: [i],
      intermediateText: result,
      meta: {
        calculation: options.showMath 
          ? `${char} → ${y} → ${aInv}×(${y} - ${b}) mod 26 = ${decrypted} → ${finalChar}`
          : `${char} → ${finalChar}`
      }
    });
  }
  
  frames.push({
    id: 'complete',
    label: 'Decryption Complete',
    operationType: 'complete',
    highlightIndices: [],
    intermediateText: result,
    meta: { calculation: `Final plaintext: ${result}` }
  });
  
  return { output: result, frames, characters };
};
