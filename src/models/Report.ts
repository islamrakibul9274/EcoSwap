import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId;
  targetType: 'LISTING' | 'USER';
  targetId: mongoose.Types.ObjectId;
  reason: string;
  status: 'Pending' | 'Resolved' | 'Dismissed';
  adminNotes?: string;
  createdAt: Date;
}

const ReportSchema: Schema = new Schema({
  reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['LISTING', 'USER'], required: true },
  targetId: { type: Schema.Types.ObjectId, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Resolved', 'Dismissed'], default: 'Pending' },
  adminNotes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
