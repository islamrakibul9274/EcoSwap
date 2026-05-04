const BANNED_KEYWORDS = [
  'spam', 'scam', 'free money', 'winner', 'crypto', 'bitcoin', 'investment',
  'casino', 'porn', 'sex', 'viagra', 'cialis', 'cheap drugs'
];

export function detectSpam(text: string): boolean {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  
  // 1. Keyword check
  const hasBannedKeyword = BANNED_KEYWORDS.some(keyword => lowerText.includes(keyword));
  if (hasBannedKeyword) return true;

  // 2. Excessive special characters or capitalization
  const capsCount = (text.match(/[A-Z]/g) || []).length;
  if (capsCount > text.length * 0.5 && text.length > 20) return true;

  // 3. Link density
  const links = (text.match(/https?:\/\/[^\s]+/g) || []).length;
  if (links > 2) return true;

  return false;
}

export const SPAM_THRESHOLD = 3; // Number of flags before automatic hiding
