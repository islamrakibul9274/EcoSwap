import { detectSpam } from '../spam-detector';

describe('Spam Detector Utility', () => {
  it('should return true for content with prohibited keywords', () => {
    const content = "Buy cheap meds now! Best prices on the internet.";
    expect(detectSpam(content)).toBe(true);
  });

  it('should return true for content with high density of "swap" keywords (potential spam)', () => {
    // Assuming detectSpam checks for repetitive keywords
    const content = "Swap swap swap swap swap swap swap swap swap swap swap swap";
    expect(detectSpam(content)).toBe(true);
  });

  it('should return false for normal plant-related content', () => {
    const content = "I have a healthy Monstera Deliciosa available for swap. It's about 2 feet tall and well-cared for.";
    expect(detectSpam(content)).toBe(false);
  });

  it('should return true for content that is too short', () => {
    const content = "hi";
    expect(detectSpam(content)).toBe(true);
  });
});
