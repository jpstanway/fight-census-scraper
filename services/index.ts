import { savePastEvents, saveAllMatches } from './events';
import { saveAllFighters } from './fighters';
import { getFighterPhysicalStatsAlt } from '../scraper/fighters';

const scraper = async () => {
  console.log('scraping events...');
  const savedEvents = await savePastEvents();
  console.log('scraping matches...');
  const savedMatches = await saveAllMatches(savedEvents);
  console.log('scraping fighters...');
  const savedFighters = await saveAllFighters(savedMatches);
  console.log('Data collection complete!', `${savedFighters.length} events saved`);
};

export default scraper;