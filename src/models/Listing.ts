import mongoose, { Schema, Document } from 'mongoose';

export interface IListing extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  type: 'Cutting' | 'Rooted Plant' | 'Full Plant';
  category: 'Houseplants' | 'Succulents' | 'Cacti' | 'Tropicals' | 'Herbs' | 'Rare' | 'Other';
  description: string;
  imageUrl?: string;
  status: 'Available' | 'Pending' | 'Swapped';
  location: {
    type: string;
    coordinates: number[]; // [longitude, latitude]
  };
  createdAt: Date;
}

const ListingSchema: Schema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Cutting', 'Rooted Plant', 'Full Plant'], required: true },
  category: { 
    type: String, 
    enum: ['Houseplants', 'Succulents', 'Cacti', 'Tropicals', 'Herbs', 'Rare', 'Other'], 
    default: 'Other' 
  },
  description: { type: String, required: true },
  imageUrl: { type: String, required: false },
  status: { type: String, enum: ['Available', 'Pending', 'Swapped'], default: 'Available' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  createdAt: { type: Date, default: Date.now }
});

ListingSchema.index({ location: '2dsphere' }); // For distance querying

export default mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);
