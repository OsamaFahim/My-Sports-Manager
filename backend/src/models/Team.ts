import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayer {
  _id?: string;
  name: string;
  age: number;
  position: string;
  stats: string;
}

export interface ITeam extends Document {
  // owner (kind of a foreign key to user)
  username: string; // owner (kind of a foreign key to user)
  name: string;
  players: IPlayer[];
}

const PlayerSchema: Schema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  position: { type: String, required: true },
  stats: { type: String, required: true },
});

const TeamSchema: Schema = new Schema({
  // owner, as mentioned above 
  username: { type: String, required: true }, 
  name: { type: String, required: true },
  players: { type: [PlayerSchema], default: [] },
});

export default mongoose.model<ITeam>('Team', TeamSchema);