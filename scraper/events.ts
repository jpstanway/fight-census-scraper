import axios from "axios";
import cheerio from "cheerio";

import { Event, Match, Fighter } from '../types';
import { createFighter } from './utils/events.utils';

const baseURL = "https://en.wikipedia.org";
const currentYear = new Date().getFullYear();
const eventsURL = `/wiki/${currentYear}_in_UFC`;

/****************************************************** */
//@desc:    collect links to all past UFC events in 2020
//@source:  wikipedia
//@data:    link, title, date, venue, city, country
/****************************************************** */
export const getPastEvents = async () => {
  const { data } = await axios.get(baseURL + eventsURL);
  const events: Event[] = [];
  
  cheerio("h3", data).each((index, element) => {
    const h3 = cheerio(element);

    if (h3.text().toLowerCase().includes('past events')) {
      const table = h3.next('.wikitable').find('tbody');
      
      cheerio("tr", table).each((index, element) => {
        const row = cheerio(element).find("td");
        let id = parseInt(row.eq(0).text().trim());
        
        if (!isNaN(id) || id.toString().includes("–")) {
          if (isNaN(id)) {
            id = index;
          }
          const title = row.eq(1).text().trim();
          const link = row.eq(1).find("a")[0].attribs.href;
          const date = new Date(row.eq(2).text().trim());
          const venue = row.eq(3).text().trim();
          const city = row.eq(4).text().trim();
          const country = row.eq(5).text().trim();

          events.push({
            title, 
            link, 
            date, 
            venue, 
            city, 
            country
          });
        }
      });
    }
  });

  return Promise.all(events);
};

/***************************************** */
//@desc:    collect match data for an event
//@source:  wikipedia
//@data:    fighter names, links, weight class,
//          fight result (method), round and time
/***************************************** */
export const getMatches = async (eventUrl: string) => {
  const { data } = await axios.get(baseURL + eventUrl);
  let matches: Match[] = [];

  const event = cheerio("h1.firstHeading").text();

  cheerio("h2", data).each((index, element) => {
    const h2 = cheerio(element);

    if (h2.text().toLowerCase().includes("results")) {
      const table = h2.next('table').find('tbody');
      
      matches = cheerio("tr", table).map((index, element) => {
        const row = cheerio(element).find("td");
        
        if (row.length > 0) {
          const division = row.eq(0).text().trim();
          const result = row.eq(4).text().trim();
          const round = row.eq(5).text().trim();
          const time = row.eq(6).text().trim();
          const red: Fighter = createFighter(row.eq(1));
          const blue: Fighter = createFighter(row.eq(3));  
          
          return {
            event,
            division,
            red,
            blue,
            result,
            round,
            time
          };
        }
      })
      .get();

      return false;
    }
  });
  
  return Promise.all(matches);
};