import { savePastEvents, saveAllMatches } from './events';
import { saveAllFighters, saveAddtlFighters, updateChampions } from './fighters';

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
  const updatedChampions = await updateChampions();
  console.log(`${updatedChampions.length} champions updated!`);
};

export default scraper;