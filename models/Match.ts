import mongoose from 'mongoose';
const { Schema } = mongoose;

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

const Match = mongoose.model('Match', matchSchema);

export default Match;