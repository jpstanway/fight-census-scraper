import mongoose from 'mongoose';
const { Schema } = mongoose;

const fighterSchema = new Schema({
  name: String,
  link: String,
  height: String,
  weight: String,
  division: String,
  reach: String
});

const Fighter = mongoose.model('Fighter', fighterSchema);

export default Fighter;