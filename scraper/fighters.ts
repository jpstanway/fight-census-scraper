import axios from "axios";
import cheerio from "cheerio";
import axiosRetry from 'axios-retry';
import { removeAccentsFromName } from './utils/fighters.utils';

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
  
  try {
    const { data } = await axios.get(baseURL + format);

    let height: string = ''; 
    let weight: string = '';
    let division: string = '';
    let reach: string = '';

    cheerio(".infobox", data).find("th").each((index, element) => {
      const th = cheerio(element);

      if (th.text().toLowerCase() === "height") height = th.next().text().trim();
      if (th.text().toLowerCase() === "weight") weight = th.next().text().trim();
      if (th.text().toLowerCase() === "division") division = th.next().text().trim();
      if (th.text().toLowerCase() === "reach") reach = th.next().text().trim();
    });
    
    return {
      height,
      weight,
      division,
      reach
    };
  } catch (error) {
    console.log(`Error retrieving data from ${format}`);
  }
};

/***************************************** */
//@desc:    collect fighter size stats
//@source:  
//@data:    height, weight, reach, division
/***************************************** */
export const getFighterPhysicalStatsAlt = async (fighterName: string) => {
  const format = removeAccentsFromName(fighterName);
  const nameUrl = format.toLowerCase().replace(/\s/g, "+");
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
    let reach: string = '';

    const div = cheerio('.size_info', result.data);
    const findHeight = div.find('.height').find('strong').text().trim();
    const findWeight = div.find('.weight').find('strong').text().trim();
    const findDivision = div.find('.wclass').find('strong').text().trim();

    if (findHeight) height = findHeight;
    if (findWeight) weight = findWeight;
    if (findDivision) division = findDivision;

    return {
      height,
      weight,
      division,
      reach,
      link: sherUrl
    };
  } catch (error) {
    console.log(`Error retrieving data for ${fighterName} at ${sherUrl}`);
  }
};