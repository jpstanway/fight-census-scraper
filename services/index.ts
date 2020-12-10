import { savePastEvents, saveAllMatches } from './events';
import { saveAllFighters, saveAddtlFighters } from './fighters';

const scraper = async () => {
  console.log('scraping events...');
  const savedEvents = await savePastEvents();
  console.log('scraping matches...');
  const savedMatches = await saveAllMatches(savedEvents);
  console.log('scraping fighters...');
  const savedFighters = await saveAllFighters(savedMatches);
  console.log('Data collection complete!', `${savedFighters.length} events saved`);
  const savedAddtlFighters = await saveAddtlFighters();
  console.log(`${savedAddtlFighters.length} additional fighters saved!`);
};

export default scraper;