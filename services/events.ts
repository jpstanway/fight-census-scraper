import Event from '../models/Event';
import Match from '../models/Match';
import { getPastEvents, getMatches } from '../scraper/events';

export const savePastEvents = async () => {
  const events = await getPastEvents();

  try {
    const res = await Event.insertMany(events, { ordered: false });
    if (res.length > 0) {
      console.log(`Successfully saved ${res.length} events!`);
    }
  } catch (error) {
    if (error.code === 11000) {
      console.log('Duplicates skipped...');
    } else {
      console.log(error);
    }
  }
  
  return await Event.find({});
};

export const saveMatches = async (event: any) => {
  const matches = await getMatches(event.title, event.link);

  try {
    const res = await Match.insertMany(matches, { ordered: false });  
    if (res.length > 0) {
      const matchIds = res.map((m) => m._id);
      await Event.updateOne({ title: event.title }, { $set: { matches: matchIds }});
      console.log(`Successfully saved ${res.length} matches!`);
    }
  } catch (error) {
    if (error.code === 11000) {
      console.log('Duplicates skipped...');
    } else {
      console.log(error);
    }
  }

  return await Match.find({});
};