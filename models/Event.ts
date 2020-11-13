import mongoose from 'mongoose';
const { Schema } = mongoose;

const eventSchema = new Schema({
  title: String,
  link: String,
  date: Date,
  venue: String,
  city: String,
  country: String,
  matches: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Match'
    }
  ]
});

const Event = mongoose.model('Event', eventSchema);

export default Event;