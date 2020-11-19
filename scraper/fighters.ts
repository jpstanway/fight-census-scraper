import axios from "axios";
import cheerio from "cheerio";
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3 });

const baseURL = "https://en.wikipedia.org";

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