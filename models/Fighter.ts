import mongoose from 'mongoose';
const { Schema } = mongoose;

const fighterSchema = new Schema({
  name: { type: String, unique: true },
  link: String,
  height: String,
  weight: String,
  division: String,
  reach: String
});

const Fighter = mongoose.model('Fighter', fighterSchema);

export default Fighter;