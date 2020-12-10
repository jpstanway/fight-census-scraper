import Fighter from '../models/Fighter';
import Match from '../models/Match';
import { Match as MatchType, Fighter as FighterType } from '../types';
import { 
  getFighterPhysicalStats, 
  getFighterPhysicalStatsAlt, 
  getAddtlFighters 
} from '../scraper/fighters';
import { removeAccentsFromName } from '../scraper/utils/fighters.utils';

export const saveAllFighters = async (matches: MatchType[][]) => {
  const matchesMap = matches.map(async (matchGroup: MatchType[]) => {
    const batch = matchGroup.map(async (match: MatchType) => {
      try {
        const fighters = [
          await saveFighter(match.red),
          await saveFighter(match.blue)
        ];

        return Promise.all(fighters);
      } catch (error) {
        console.log(error);
      }
    });

    console.log('Fighter batch complete...');
    return Promise.all(batch);
  });

  return matchesMap;
};

export const saveFighter = async (fighter: FighterType) => {
  let obj = {
    name: fighter.name,
    link: fighter.link
  };

  try {
    if (obj.link && !obj.link.includes('sherdog')) {
      const fighterStats = await getFighterPhysicalStats(obj.link);
      obj = { ...obj, ...fighterStats }; 
    } else {
      const fighterStatsAlt = await getFighterPhysicalStatsAlt(obj.name);
      obj = { ...obj, ...fighterStatsAlt };
    }
  
    return await Fighter.updateOne({ name: obj.name }, obj, { upsert: true });
  } catch (error) {
    console.log(error);
  }
};

export const saveAddtlFighters = async () => {
  const matches = await Match.find({});
  const fighters = await getAddtlFighters();
  const fightersMap = fighters
    .filter((fighter: FighterType) => { 
      return !matches.some((match) => {
        const red = removeAccentsFromName(match.red.name);
        const blue = removeAccentsFromName(match.blue.name);
        const incoming = removeAccentsFromName(fighter.name);

        return red.toLowerCase().includes(incoming.toLowerCase()) 
          || blue.toLowerCase().includes(incoming.toLowerCase())
          || (fighter.link && match.red.link.toLowerCase().includes(fighter.link.toLowerCase()))
          || (fighter.link && match.blue.link.toLowerCase().includes(fighter.link.toLowerCase()));
      });
    })
    .map(async (fighter: FighterType) => {
      const obj = {
        name: fighter.name,
        link: fighter.link
      };

      // save fighter
      return await saveFighter(obj);
    });
  
  return Promise.all(fightersMap);
};

