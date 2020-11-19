import mongoose from 'mongoose';
const { Schema } = mongoose;

interface FighterDoc extends mongoose.Document {
  name: string,
  link: string,
  height: string,
  weight: string,
  division: string,
  reach: string
}

const fighterSchema = new Schema({
  name: { type: String, unique: true },
  link: String,
  height: String,
  weight: String,
  division: String,
  reach: String
});

const Fighter = mongoose.model<FighterDoc>('Fighter', fighterSchema);

export default Fighter;