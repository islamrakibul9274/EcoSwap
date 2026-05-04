import User from '@/models/User';
import connectToDatabase from '@/lib/db';

export type ActionType = 'LIST_PLANT' | 'COMPLETE_SWAP' | 'RECEIVE_5_STAR' | 'LEAVE_REVIEW';

const XP_MAP: Record<ActionType, number> = {
  LIST_PLANT: 50,
  COMPLETE_SWAP: 200,
  RECEIVE_5_STAR: 100,
  LEAVE_REVIEW: 20,
};

export async function awardXP(userId: string, action: ActionType) {
  try {
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) return;

    const xpToAdd = XP_MAP[action];
    user.xp += xpToAdd;

    // Level formula: level = floor(sqrt(xp / 100)) + 1
    // e.g., Level 1: 0 XP, Level 2: 100 XP, Level 3: 400 XP, Level 4: 900 XP
    const newLevel = Math.floor(Math.sqrt(user.xp / 100)) + 1;
    
    if (newLevel > user.level) {
      user.level = newLevel;
      // Future: add notification for level up
    }

    // Check for badges
    const badges = user.badges || [];
    
    // First Sprout
    if (action === 'LIST_PLANT' && !badges.includes('🌱 First Sprout')) {
      badges.push('🌱 First Sprout');
    }

    // Green Thumb (5 swaps)
    // We need to count swaps, but for now we can track it in user or just award on specific action
    // A better way is to count completed swaps in DB
    
    user.badges = badges;
    await user.save();
    
    return { xp: user.xp, level: user.level, badges: user.badges };
  } catch (error) {
    console.error('Failed to award XP:', error);
  }
}
