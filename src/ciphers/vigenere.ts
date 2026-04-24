import { Frame, CipherOptions, CipherResult, CharacterData } from '../types';
import { charToNum, numToChar, mod, normalizeText } from '../utils/helpers';

export const vigenereEncrypt = (
  plaintext: string,
  key: string,
  options: CipherOptions
): CipherResult => {
  const frames: Frame[] = [];
  const characters: CharacterData[] = [];
  
  if (!key || key.length === 0) {
    frames.push({
      id: 'error',
      label: 'Invalid Key',
      operationType: 'error',
      highlightIndices: [],
      intermediateText: '',
      meta: { calculation: 'Error: Key cannot be empty' }
    });
    return { output: '', frames, characters };
  }
  
  const normalized = normalizeText(plaintext, {
    keepNonLetters: options.keepNonLetters,
    toUpper: !options.preserveCase
  });
  
  const normalizedKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  
  frames.push({
    id: 'init',
    label: 'Initialize Vigenère Cipher',
    operationType: 'init',
    highlightIndices: [],
    intermediateText: normalized,
    meta: {
      calculation: `Using key: ${normalizedKey} (repeating)`
    }
  });
  
  let result = '';
  let keyIndex = 0;
  
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
      
      if (options.keyStreamBehavior !== 'consume') {
        continue;
      }
    }
    
    if (!/[A-Z]/i.test(char)) {
      continue;
    }
    
    const isUpper = char === char.toUpperCase();
    const charNum = charToNum(char);
    const keyChar = normalizedKey[keyIndex % normalizedKey.length];
    const keyNum = charToNum(keyChar);
    const encryptedNum = mod(charNum + keyNum, 26);
    const encryptedChar = numToChar(encryptedNum);
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
        { step: 1, value: `${charNum} + ${keyNum}`, operation: `Add key char '${keyChar}'` },
        { step: 2, value: encryptedNum.toString(), operation: `(${charNum} + ${keyNum}) mod 26` },
        { step: 3, value: finalChar, operation: 'Convert to letter' }
      ]
    });
    
    frames.push({
      id: `char-${i}`,
      label: `Encrypt '${char}' with key '${keyChar}'`,
      operationType: 'encrypt',
      highlightIndices: [i],
      intermediateText: result,
      meta: {
        calculation: options.showMath 
          ? `${char}(${charNum}) + ${keyChar}(${keyNum}) = ${encryptedNum} → ${finalChar}`
          : `${char} + ${keyChar} = ${finalChar}`,
        keyPosition: keyIndex % normalizedKey.length
      }
    });
    
    keyIndex++;
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

export const vigenereDecrypt = (
  ciphertext: string,
  key: string,
  options: CipherOptions
): CipherResult => {
  const frames: Frame[] = [];
  const characters: CharacterData[] = [];
  
  if (!key || key.length === 0) {
    frames.push({
      id: 'error',
      label: 'Invalid Key',
      operationType: 'error',
      highlightIndices: [],
      intermediateText: '',
      meta: { calculation: 'Error: Key cannot be empty' }
    });
    return { output: '', frames, characters };
  }
  
  const normalized = normalizeText(ciphertext, {
    keepNonLetters: options.keepNonLetters,
    toUpper: !options.preserveCase
  });
  
  const normalizedKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  
  frames.push({
    id: 'init',
    label: 'Initialize Vigenère Decryption',
    operationType: 'init',
    highlightIndices: [],
    intermediateText: normalized,
    meta: {
      calculation: `Using key: ${normalizedKey} (repeating)`
    }
  });
  
  let result = '';
  let keyIndex = 0;
  
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    
    if (!/[A-Z]/i.test(char)) {
      result += char;
      if (options.keyStreamBehavior !== 'consume') {
        continue;
      }
    }
    
    if (!/[A-Z]/i.test(char)) {
      continue;
    }
    
    const isUpper = char === char.toUpperCase();
    const charNum = charToNum(char);
    const keyChar = normalizedKey[keyIndex % normalizedKey.length];
    const keyNum = charToNum(keyChar);
    const decryptedNum = mod(charNum - keyNum, 26);
    const decryptedChar = numToChar(decryptedNum);
    const finalChar = (options.preserveCase && !isUpper) 
      ? decryptedChar.toLowerCase() 
      : decryptedChar;
    
    result += finalChar;
    
    frames.push({
      id: `char-${i}`,
      label: `Decrypt '${char}' with key '${keyChar}'`,
      operationType: 'decrypt',
      highlightIndices: [i],
      intermediateText: result,
      meta: {
        calculation: options.showMath 
          ? `${char}(${charNum}) - ${keyChar}(${keyNum}) = ${decryptedNum} → ${finalChar}`
          : `${char} - ${keyChar} = ${finalChar}`,
        keyPosition: keyIndex % normalizedKey.length
      }
    });
    
    keyIndex++;
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
