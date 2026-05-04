import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  targetType: 'USER' | 'LISTING' | 'REPORT' | 'SETTING';
  targetId: mongoose.Types.ObjectId;
  details: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  targetType: { type: String, enum: ['USER', 'LISTING', 'REPORT', 'SETTING'], required: true },
  targetId: { type: Schema.Types.ObjectId, required: true },
  details: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
