// call scraper functions and save to database

// scrape past events and save to db

// loop through saved events and scrape match data
// save match data as well as each fighter

// loop through matches -> fighters and collect additional data

import { savePastEvents } from './events';

const scraper = async () => {
  console.log('scraping events...');
  await savePastEvents();
};

export default scraper;