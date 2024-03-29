import mongoose from 'mongoose';
const { Schema } = mongoose;

interface MatchDoc extends mongoose.Document {
  event: string,
  division: string,
  red: {
    name: string,
    link: string
  },
  blue: {
    name: string,
    link: string
  },
  result: string,
  round: string,
  time: string
}

const matchSchema = new Schema({
  event: String,
  division: String,
  red: {
    name: String,
    link: String
  },
  blue: {
    name: String,
    link: String
  },
  result: String,
  round: String,
  time: String
});

matchSchema.index({
  event: 1,
  red: 1,
  blue: 1
}, { unique: true });

const getMatchModel = (year: string = '') => {
  let model = 'Match';
  if (year) {
    model += year;
  }
  return mongoose.model<MatchDoc>(model, matchSchema);
};

const Match = getMatchModel('2021');

export default Match;