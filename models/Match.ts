import mongoose from 'mongoose';
const { Schema } = mongoose;

const matchSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  division: String,
  red: {
    type: Schema.Types.ObjectId,
    ref: 'Fighter'
  },
  blue: {
    type: Schema.Types.ObjectId,
    ref: 'Fighter'
  },
  result: String,
  round: String,
  time: String
});

const Match = mongoose.model('Match', matchSchema);

export default Match;