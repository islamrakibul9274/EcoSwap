import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'request' | 'message' | 'system' | 'SWAP_UPDATE' | 'SWAP_REQUEST' | 'REVIEW' | 'ADMIN';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['request', 'message', 'system', 'SWAP_UPDATE', 'SWAP_REQUEST', 'REVIEW', 'ADMIN'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  link: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// In Next.js development, models can get cached with old schemas.
// This ensures we always use the latest schema definition.
if (mongoose.models.Notification) {
  delete mongoose.models.Notification;
}

export default mongoose.model<INotification>('Notification', NotificationSchema);
