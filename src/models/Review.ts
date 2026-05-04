import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  swapRequestId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  revieweeId: mongoose.Types.ObjectId;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  swapRequestId: { type: Schema.Types.ObjectId, ref: 'SwapRequest', required: true },
  reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  revieweeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
