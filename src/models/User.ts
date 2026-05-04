import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  avatar?: string;
  notificationPreferences?: {
    email: boolean;
    inApp: boolean;
  };
  wishlist: mongoose.Types.ObjectId[];
  xp: number;
  level: number;
  badges: string[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: String, enum: ['USER', 'ADMIN', 'MODERATOR'], default: 'USER' },
  avatar: { type: String, required: false },
  notificationPreferences: {
    email: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true }
  },
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Listing' }],
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
