import axios from "axios";
import cheerio from "cheerio";

import { FighterStats } from '../types';

const baseURL = "https://en.wikipedia.org";

/***************************************** */
//@desc:    collect fighter size stats
//@source:  wikipedia
//@data:    height, weight, reach, division
/***************************************** */
export const getFighterPhysicalStats = async (fighterUrl: string) => {
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
  
  const fighterStats: FighterStats = {
    height,
    weight,
    division,
    reach
  };

  return fighterStats;
};