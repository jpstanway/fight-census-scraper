import Event from '../models/Event';
import Match from '../models/Match';
import { getPastEvents, getMatches } from '../scraper/events';
import { Event as EventType, Match as MatchType } from '../types';

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

export const saveAllMatches = async (events: EventType[]) => {
  const eventsMap = events.map(async (event: EventType) => {
    return await saveMatches(event);
  });

  return Promise.all(eventsMap);
};

export const saveMatches = async (event: EventType) => {
  const matches = await getMatches(event.title, event.link);

  try {
    const res = await Match.insertMany(matches, { ordered: false, });  
    if (res.length > 0) {
      console.log(`Successfully saved ${res.length} matches!`);
    }
  } catch (error) {
    if (error.code === 11000) {
      console.log('Duplicates skipped...');
    } else {
      console.log(error);
    }
  }

  return matches;
};