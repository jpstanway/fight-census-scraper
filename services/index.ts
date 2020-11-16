import { savePastEvents, saveMatches } from './events';

const scraper = async () => {
  console.log('scraping events...');
  const savedEvents = await savePastEvents()
  console.log('scraping matches...');
  savedEvents.forEach(async (event) => {
    const savedMatches = await saveMatches(event);
    console.log('scraping fighters...');
    
  });
};

export default scraper;