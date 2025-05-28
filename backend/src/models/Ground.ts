import mongoose, { Document, Schema } from 'mongoose';

export interface IGround extends Document {
  username: string; // Owner
  name: string;
  location: string;
  capacity: number;
  facilities: string;
}

const GroundSchema: Schema = new Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  facilities: { type: String, required: true }
});

export default mongoose.model<IGround>('Ground', GroundSchema);