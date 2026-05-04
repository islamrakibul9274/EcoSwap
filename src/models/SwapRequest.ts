import mongoose, { Schema, Document } from 'mongoose';

export interface ISwapRequest extends Document {
  requesterId: mongoose.Types.ObjectId;
  targetListingId: mongoose.Types.ObjectId;
  targetOwnerId: mongoose.Types.ObjectId;
  offeredListingId?: mongoose.Types.ObjectId; // Optional if they just want to chat/buy
  message: string;
  status: 'Pending' | 'Accepted' | 'Declined' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

const SwapRequestSchema: Schema = new Schema({
  requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetListingId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  targetOwnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  offeredListingId: { type: Schema.Types.ObjectId, ref: 'Listing', required: false },
  message: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Declined', 'Completed'], default: 'Pending' },
}, { timestamps: true });

export default mongoose.models.SwapRequest || mongoose.model<ISwapRequest>('SwapRequest', SwapRequestSchema);
