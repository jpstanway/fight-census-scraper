import axios from "axios";
import cheerio from "cheerio";
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3 });

const baseURL = "https://en.wikipedia.org";
const altUrl = "https://www.google.com/search?q=tapology+";

/***************************************** */
//@desc:    collect fighter size stats
//@source:  wikipedia
//@data:    height, weight, reach, division
/***************************************** */
export const getFighterPhysicalStats = async (fighterUrl: string) => {
  try {
    const { data } = await axios.get(baseURL + fighterUrl);

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
    console.log(error);
  }
};

/***************************************** */
//@desc:    collect fighter size stats
//@source:  tapology
//@data:    height, weight, reach, division
/***************************************** */
export const getFighterPhysicalStatsAlt = async (fighterName: string) => {
  // PART 1: retrieve url for stats page
  const nameUrl = fighterName.toLowerCase().replace(/\s/g, "+");
  const { data } = await axios.get(altUrl + nameUrl);
  let tapUrl: any;

  cheerio("a", data).each((index, element) => {
    const a = cheerio(element)[0].attribs.href;

    if (!tapUrl && a.includes("www.tapology.com/fightcenter/fighters")) {
      tapUrl = a;
    }
  });

  // clean up url as best as possible
  tapUrl = tapUrl.match(/https.*?&/i);
  tapUrl = tapUrl[0].substring(0, tapUrl[0].length - 1);
  
  // PART 2: visit stats page and gather data
  const result = await axios.get(tapUrl);

};