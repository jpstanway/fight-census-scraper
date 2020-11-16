import mongoose from 'mongoose';
const { Schema } = mongoose;

const eventSchema = new Schema({
  title: { type: String, unique: true },
  link: String,
  date: Date,
  venue: String,
  city: String,
  country: String
});

const Event = mongoose.model('Event', eventSchema);

export default Event;