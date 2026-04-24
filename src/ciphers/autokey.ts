import { Frame, CipherOptions, CipherResult, CharacterData } from '../types';
import { charToNum, numToChar, mod, normalizeText } from '../utils/helpers';

export const autokeyEncrypt = (
  plaintext: string,
  keyword: string,
  options: CipherOptions
): CipherResult => {
  const frames: Frame[] = [];
  const characters: CharacterData[] = [];

  const normalized = normalizeText(plaintext, {
    keepNonLetters: options.keepNonLetters,
    toUpper: !options.preserveCase,
  });

  const cleanKw = keyword.toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';
  const lettersOnly = normalized.replace(/[^A-Z]/gi, '').toUpperCase();
  const fullKey = (cleanKw + lettersOnly).toUpperCase();

  frames.push({
    id: 'init',
    label: 'Build the Autokey Keystream',
    operationType: 'init',
    highlightIndices: [],
    intermediateText: normalized,
    meta: {
      calculation: `Keyword: "${cleanKw}" + Plaintext letters → Full key: "${fullKey.slice(0, lettersOnly.length)}"`,
    },
  });

  let result = '';
  let ki = 0;

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];

    if (!/[A-Za-z]/.test(char)) {
      result += char;
      characters.push({
        origChar: char,
        normalizedChar: char,
        index: i,
        stepHistory: [{ step: 0, value: char, operation: 'Non-letter preserved' }],
      });
      continue;
    }

    const isUpper = char === char.toUpperCase();
    const pNum = charToNum(char);
    const keyChar = fullKey[ki] || 'A';
    const kNum = charToNum(keyChar);
    const cNum = mod(pNum + kNum, 26);
    const encChar = numToChar(cNum);
    const finalChar = options.preserveCase && !isUpper ? encChar.toLowerCase() : encChar;
    result += finalChar;
    ki++;

    const keySource = ki - 1 < cleanKw.length ? `keyword` : `plaintext[${ki - 1 - cleanKw.length}]`;

    characters.push({
      origChar: char,
      normalizedChar: char.toUpperCase(),
      index: i,
      stepHistory: [
        { step: 0, value: char.toUpperCase(), operation: 'Plaintext letter' },
        { step: 1, value: keyChar, operation: `Key letter (from ${keySource})` },
        { step: 2, value: String(cNum), operation: `(${pNum}+${kNum}) mod 26` },
        { step: 3, value: finalChar, operation: 'Ciphertext' },
      ],
    });

    frames.push({
      id: `char-${i}`,
      label: `Encrypt '${char.toUpperCase()}' with key '${keyChar}'`,
      operationType: 'encrypt',
      highlightIndices: [i],
      intermediateText: result,
      meta: {
        calculation: options.showMath
          ? `${char.toUpperCase()}(${pNum}) + ${keyChar}(${kNum}) mod 26 = ${cNum} → ${encChar}   [key from: ${keySource}]`
          : `${char.toUpperCase()} + ${keyChar} → ${encChar}`,
      },
    });
  }

  frames.push({
    id: 'complete',
    label: 'Encryption Complete',
    operationType: 'complete',
    highlightIndices: [],
    intermediateText: result,
    meta: { calculation: `Ciphertext: ${result}` },
  });

  return { output: result, frames, characters };
};

export const autokeyDecrypt = (
  ciphertext: string,
  keyword: string,
  options: CipherOptions
): CipherResult => {
  const frames: Frame[] = [];
  const characters: CharacterData[] = [];

  const normalized = normalizeText(ciphertext, {
    keepNonLetters: options.keepNonLetters,
    toUpper: !options.preserveCase,
  });

  const cleanKw = keyword.toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';
  const keyStream = cleanKw.split('');

  frames.push({
    id: 'init',
    label: 'Autokey Decryption — Key grows as we decrypt',
    operationType: 'init',
    highlightIndices: [],
    intermediateText: normalized,
    meta: {
      calculation: `Start with keyword: "${cleanKw}". Each decrypted letter extends the key.`,
    },
  });

  let result = '';
  let ki = 0;

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];

    if (!/[A-Za-z]/.test(char)) {
      result += char;
      characters.push({
        origChar: char,
        normalizedChar: char,
        index: i,
        stepHistory: [{ step: 0, value: char, operation: 'Non-letter preserved' }],
      });
      continue;
    }

    const isUpper = char === char.toUpperCase();
    const cNum = charToNum(char);
    const keyChar = keyStream[ki] || 'A';
    const kNum = charToNum(keyChar);
    const pNum = mod(cNum - kNum, 26);
    const decChar = numToChar(pNum);
    const finalChar = options.preserveCase && !isUpper ? decChar.toLowerCase() : decChar;
    result += finalChar;
    keyStream.push(decChar);
    ki++;

    characters.push({
      origChar: char,
      normalizedChar: char.toUpperCase(),
      index: i,
      stepHistory: [
        { step: 0, value: char.toUpperCase(), operation: 'Ciphertext letter' },
        { step: 1, value: keyChar, operation: `Key letter` },
        { step: 2, value: String(pNum), operation: `(${cNum}-${kNum}+26) mod 26` },
        { step: 3, value: finalChar, operation: 'Plaintext' },
      ],
    });

    frames.push({
      id: `char-${i}`,
      label: `Decrypt '${char.toUpperCase()}' with key '${keyChar}' → '${decChar}'`,
      operationType: 'decrypt',
      highlightIndices: [i],
      intermediateText: result,
      meta: {
        calculation: options.showMath
          ? `${char.toUpperCase()}(${cNum}) - ${keyChar}(${kNum}) mod 26 = ${pNum} → ${decChar}   [key extended: "${decChar}" added]`
          : `${char.toUpperCase()} - ${keyChar} → ${decChar}`,
      },
    });
  }

  frames.push({
    id: 'complete',
    label: 'Decryption Complete',
    operationType: 'complete',
    highlightIndices: [],
    intermediateText: result,
    meta: { calculation: `Plaintext: ${result}` },
  });

  return { output: result, frames, characters };
};
