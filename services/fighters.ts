import Fighter from '../models/Fighter';
import { Match as MatchType, Fighter as FighterType } from '../types';
import { getFighterPhysicalStats, getFighterPhysicalStatsAlt } from '../scraper/fighters';

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
      console.log(obj);
    }
  
    return await Fighter.updateOne({ name: obj.name }, obj, { upsert: true });
  } catch (error) {
    console.log(error);
  }
};

