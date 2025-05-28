import { Schema, model, Document } from 'mongoose';

export interface IMatch extends Document {
  username: string;
  teamA: string;
  teamB: string;
  ground: string;
  datetime: string; // ISO string
}

const matchSchema = new Schema<IMatch>({
  username: { type: String, required: true },
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  ground: { type: String, required: true },
  datetime: { type: String, required: true },
});

export default model<IMatch>('Match', matchSchema);