import { Frame, CipherOptions, CipherResult, CharacterData } from '../types';
import { charToNum, numToChar, mod, normalizeText } from '../utils/helpers';

export const caesarEncrypt = (
  plaintext: string,
  shift: number,
  options: CipherOptions
): CipherResult => {
  console.log('Caesar Encrypt called with:', { plaintext, shift, options });
  const frames: Frame[] = [];
  const characters: CharacterData[] = [];
  
  const normalized = normalizeText(plaintext, {
    keepNonLetters: options.keepNonLetters,
    toUpper: !options.preserveCase
  });
  
  console.log('Normalized text:', normalized);
  
  frames.push({
    id: 'init',
    label: 'Initialize Caesar Cipher',
    operationType: 'init',
    highlightIndices: [],
    intermediateText: normalized,
    meta: {
      calculation: `Using shift value: ${shift}`
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
      
      if (options.verbosity === 'detailed') {
        frames.push({
          id: `skip-${i}`,
          label: `Skip non-letter: '${char}'`,
          operationType: 'skip',
          highlightIndices: [i],
          intermediateText: result,
          meta: { calculation: `'${char}' is not a letter, preserve as-is` }
        });
      }
      continue;
    }
    
    const isUpper = char === char.toUpperCase();
    const charNum = charToNum(char);
    const shiftedNum = mod(charNum + shift, 26);
    const shiftedChar = numToChar(shiftedNum);
    const finalChar = (options.preserveCase && !isUpper) 
      ? shiftedChar.toLowerCase() 
      : shiftedChar;
    
    result += finalChar;
    
    characters.push({
      origChar: char,
      normalizedChar: char.toUpperCase(),
      index: i,
      stepHistory: [
        { step: 0, value: char, operation: 'Original' },
        { step: 1, value: charNum.toString(), operation: 'Convert to number' },
        { step: 2, value: shiftedNum.toString(), operation: `Add shift (${charNum} + ${shift}) mod 26` },
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
          ? `${char} → ${charNum} → (${charNum} + ${shift}) mod 26 = ${shiftedNum} → ${finalChar}`
          : `${char} → ${finalChar}`,
        position: { x: i * 40, y: 100 }
      }
    });
  }
  
  frames.push({
    id: 'complete',
    label: 'Encryption Complete',
    operationType: 'complete',
    highlightIndices: [],
    intermediateText: result,
    meta: {
      calculation: `Final ciphertext: ${result}`
    }
  });
  
  console.log('Caesar Encrypt result:', { output: result, frames, characters });
  return { output: result, frames, characters };
};

export const caesarDecrypt = (
  ciphertext: string,
  shift: number,
  options: CipherOptions
): CipherResult => {
  return caesarEncrypt(ciphertext, -shift, options);
};
