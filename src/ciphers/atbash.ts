import { Frame, CipherOptions, CipherResult, CharacterData } from '../types';
import { charToNum, numToChar, normalizeText } from '../utils/helpers';

export const atbashCipher = (
  text: string,
  options: CipherOptions
): CipherResult => {
  const frames: Frame[] = [];
  const characters: CharacterData[] = [];
  
  const normalized = normalizeText(text, {
    keepNonLetters: options.keepNonLetters,
    toUpper: !options.preserveCase
  });
  
  frames.push({
    id: 'init',
    label: 'Initialize Atbash Cipher',
    operationType: 'init',
    highlightIndices: [],
    intermediateText: normalized,
    meta: {
      calculation: 'Atbash: A↔Z, B↔Y, C↔X, ... (reverse alphabet mapping)'
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
    const charNum = charToNum(char);
    const reversedNum = 25 - charNum;
    const reversedChar = numToChar(reversedNum);
    const finalChar = (options.preserveCase && !isUpper) 
      ? reversedChar.toLowerCase() 
      : reversedChar;
    
    result += finalChar;
    
    characters.push({
      origChar: char,
      normalizedChar: char.toUpperCase(),
      index: i,
      stepHistory: [
        { step: 0, value: char, operation: 'Original' },
        { step: 1, value: charNum.toString(), operation: 'Convert to number (0-25)' },
        { step: 2, value: reversedNum.toString(), operation: `Reverse: 25 - ${charNum} = ${reversedNum}` },
        { step: 3, value: finalChar, operation: 'Convert back to letter' }
      ]
    });
    
    frames.push({
      id: `char-${i}`,
      label: `Transform '${char}' → '${finalChar}'`,
      operationType: 'transform',
      highlightIndices: [i],
      intermediateText: result,
      meta: {
        calculation: options.showMath 
          ? `${char} → ${charNum} → 25 - ${charNum} = ${reversedNum} → ${finalChar}`
          : `${char} ↔ ${finalChar}`
      }
    });
  }
  
  frames.push({
    id: 'complete',
    label: 'Transformation Complete',
    operationType: 'complete',
    highlightIndices: [],
    intermediateText: result,
    meta: { calculation: `Final text: ${result}` }
  });
  
  return { output: result, frames, characters };
};
