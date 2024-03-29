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
  debut: string,
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
  debut: String,
  age: String,
  country: String,
  state: String,
  allDivisions: [String],
  reach: String,
  isChampion: { type: Boolean, default: false }
});

const getFighterModel = (year: string = '') => {
  let model = 'Fighter';
  if (year) {
    model += year;
  }
  return mongoose.model<FighterDoc>(model, fighterSchema);
};

const Fighter = getFighterModel('2021');

export default Fighter;