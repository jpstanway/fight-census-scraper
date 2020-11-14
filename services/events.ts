import Event from '../models/Event';
import { getPastEvents, getMatches } from '../scraper/events';

export const savePastEvents = async () => {
  const events = await getPastEvents();

  Event.insertMany(events, { ordered: false }, (error, result) => {
    if (error) {
      if (error.code === 11000) {
        console.log('Duplicates skipped...');
      } else {
        console.log(error.message);
      }
    } else if (result.length > 0) {
      return console.log(`Successfully saved ${result.length} events!`);
    }
    
    return console.log('Events updated!');
  });
};

export const saveMatches = async (eventUrl: string) => {
  const matches = await getMatches(eventUrl);
};