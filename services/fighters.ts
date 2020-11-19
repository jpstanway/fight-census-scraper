import Fighter from '../models/Fighter';
import { Match as MatchType, Fighter as FighterType } from '../types';
import { getFighterPhysicalStats } from '../scraper/fighters';

export const saveAllFighters = async (matches: MatchType[][]) => {
  const matchesMap = matches.map(async (matchGroup: MatchType[]) => {
    const batch = matchGroup.map(async (match: MatchType) => {
      try {
        const red = await saveFighter(match.red);
        const blue = await saveFighter(match.blue);
        return [red, blue];
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
    if (obj.link) {
      const fighterStats = await getFighterPhysicalStats(obj.link);
      obj = { ...obj, ...fighterStats }; 
    }
  
    return await Fighter.updateOne({ name: obj.name }, obj, { upsert: true });
  } catch (error) {
    console.log(error);
  }
};

