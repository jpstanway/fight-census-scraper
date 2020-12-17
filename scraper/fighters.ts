import axios from "axios";
import cheerio from "cheerio";
import axiosRetry from 'axios-retry';
import { removeAccentsFromName, createFighter } from './utils/fighters.utils';
import { IterableObject } from '../types';

axiosRetry(axios, { retries: 3 });

const baseURL = "https://en.wikipedia.org";
const altUrl = "https://www.google.com/search?q=sherdog+";

/***************************************** */
//@desc:    collect fighter size stats
//@source:  wikipedia
//@data:    height, weight, reach, division
/***************************************** */
export const getFighterPhysicalStats = async (fighterUrl: string) => {
  const decoded = decodeURI(fighterUrl);
  const format = removeAccentsFromName(decoded);
  const update: IterableObject = {};
  
  try {
    const { data } = await axios.get(baseURL + format);

    let height: string = ''; 
    let weight: string = '';
    let reach: string = '';

    cheerio(".infobox", data).find("th").each((index, element) => {
      const th = cheerio(element);
      const regex = /n?\[\d\]/g;

      if (th.text().toLowerCase() === "height") height = th.next().text().replace(regex, "").trim();
      if (th.text().toLowerCase() === "weight") weight = th.next().text().trim();
      if (th.text().toLowerCase() === "reach") reach = th.next().text().replace(regex, "").trim();
    });

    if (height) update.height = height;
    if (weight) update.weight = weight;
    if (reach) update.reach = reach;
    
    return update;
  } catch (error) {
    console.log(`Error retrieving data from ${format}`);
  }
};

/***************************************** */
//@desc:    collect fighter size stats
//@source:  sherdog
//@data:    height, weight, reach, division
/***************************************** */
export const getFighterPhysicalStatsAlt = async (fighterName: string) => {
  const format = removeAccentsFromName(fighterName);
  const nameUrl = format.toLowerCase().replace(/\s/g, "+");
  const update: IterableObject = {};
  const regex = /n?\[\d\]/g;
  let sherUrl: any;

  try {
    // PART 1: retrieve url for stats page
    const { data } = await axios.get(altUrl + nameUrl);

    cheerio("a", data).each((index, element) => {
      const a = cheerio(element)[0].attribs.href;

      if (!sherUrl && a.includes("https://www.sherdog.com/fighter")) {
        sherUrl = a;
      }
    });

    // clean up url as best as possible
    sherUrl = sherUrl.match(/https.*?&/i);
    sherUrl = sherUrl[0].substring(0, sherUrl[0].length - 1).trim();

    // PART 2: visit stats page and gather data
    const result = await axios.get(sherUrl);

    let height: string = ''; 
    let weight: string = '';
    let division: string = '';

    const div = cheerio('.size_info', result.data);
    height = div.find('.height').find('strong').text().replace(regex, "").trim();
    weight = div.find('.weight').find('strong').text().trim();
    division = div.find('.wclass').find('strong').text().trim();

    if (height) update.height = height;
    if (weight) update.weight = weight;
    if (division) update.division = division;
    update.link = sherUrl;

    return update;
  } catch (error) {
    console.log(`Error retrieving data for ${fighterName} at ${sherUrl}`);
  }
};

/***************************************** */
//@desc:    get remaining fighters (not included in events)
//@source:  wikipedia
//@data:    all divisions
/***************************************** */
export const getAddtlFighters = async () => {
  const url = baseURL + "/wiki/List_of_current_UFC_fighters";
  const { data } = await axios.get(url);
  let fightersMap: any = [];

  // iterate over each division
  const h2 = cheerio('#Debuted_fighters', data).parent();
  h2.nextAll('.wikitable').each((index, element) => {
    const regex = /^.*weight/ig;
    let division: any = cheerio(element).prev().text().match(regex);
    division = division[0] || '';
    const table = cheerio(element).find('tbody');

    cheerio('tr', table).each((index, element) => {
      if (index > 0) {
        const td = cheerio(element).children().eq(1);
        const fighter = createFighter(td, division);

        fightersMap.push(fighter);
      }
    });
  });
  
  return fightersMap;
};

/***************************************** */
//@desc:    get list of current champions
//@source:  wikipedia
//@data:    name only, save to current docs
/***************************************** */
export const getCurrentChampions = async () => {
  const url = baseURL + "/wiki/List_of_current_UFC_fighters";
  const { data } = await axios.get(url);
  let championsMap: any = [];

  cheerio('h2', data).each((index, element) => {
    const h2 = cheerio(element);

    if (h2.text().includes("Current champions")) {
      const table = h2.next().next('.wikitable').find('tbody');
      cheerio("tr", table).each((index, element) => {
        const tr = cheerio(element);
        let td: any;

        if (tr.children().length === 9) {
          td = tr.children().eq(1).text().trim();
        } else {
          td = tr.children().eq(4).text().trim();
        }
        
        if (td !== 'Champion' && td !== 'Vacant') {
          championsMap.push(td);
        }
      });
    }
  });
  
  return championsMap;
};