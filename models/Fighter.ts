import mongoose from 'mongoose';
const { Schema } = mongoose;

interface FighterDoc extends mongoose.Document {
  name: string,
  link: string,
  height: string,
  weight: string,
  age: string,
  country: string,
  state: string,
  division: string,
  allDivisions: string[],
  reach: string,
  isChampion: boolean
}

const fighterSchema = new Schema({
  name: { type: String, unique: true },
  link: String,
  height: String,
  weight: String,
  division: String,
  age: String,
  country: String,
  state: String,
  allDivisions: [String],
  reach: String,
  isChampion: { type: Boolean, default: false }
});

const Fighter = mongoose.model<FighterDoc>('Fighter', fighterSchema);

export default Fighter;