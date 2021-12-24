import mongoose from 'mongoose';
const { Schema } = mongoose;

interface EventDoc extends mongoose.Document {
  title: string,
  link: string,
  date: Date,
  venue: string,
  city: string,
  country: string,
  state: string
}

const eventSchema = new Schema({
  title: { type: String, unique: true },
  link: String,
  date: Date,
  venue: String,
  city: String,
  country: String,
  state: String
});

const getEventModel = (year: string = '') => {
  let model = 'Event';
  if (year) {
    model += year;
  }
  return mongoose.model<EventDoc>(model, eventSchema);
};

const Event = getEventModel('2021');

export default Event;