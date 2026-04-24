import { Frame } from '../types';

export const exportFramesAsJSON = (frames: Frame[], cipherType: string, timestamp: string = new Date().toISOString()): void => {
  const exportData = {
    cipher: cipherType,
    timestamp,
    totalFrames: frames.length,
    frames
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${cipherType}-cipher-frames-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

export const exportAsText = (plaintext: string, ciphertext: string, cipherType: string): void => {
  const exportText = `Classical Cipher Export
======================

Cipher Type: ${cipherType}
Date: ${new Date().toLocaleString()}

Plaintext:
${plaintext}

Ciphertext:
${ciphertext}
`;

  const dataBlob = new Blob([exportText], { type: 'text/plain' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${cipherType}-cipher-${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
