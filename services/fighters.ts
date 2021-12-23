import Fighter2021 from '../models/Fighter2021';
import Match2021 from '../models/Match2021';
import { Match as MatchType, Fighter as FighterType } from '../types';
import { 
  getFighterPhysicalStats, 
  getFighterPhysicalStatsAlt, 
  getAddtlFighters,
  getCurrentChampions 
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
  let obj: any = {
    name: fighter.name,
    division: fighter.division,
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

    // don't need to update these fields oftens
    if (obj.hasOwnProperty("country")) delete obj.country;
  
    return await Fighter2021.updateOne(
      { name: obj.name }, 
      {
        ...obj, 
        $addToSet: { allDivisions: obj.division }
      },
      { upsert: true }
    );
  } catch (error) {
    console.log(error);
  }
};

export const saveAddtlFighters = async () => {
  const matches = await Match2021.find({});
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
        link: fighter.link,
        division: fighter.division
      };

      // save fighter
      return await saveFighter(obj);
    });
  
  return Promise.all(fightersMap);
};

export const updateChampions = async () => {
  const champions = await getCurrentChampions();

  const championsMap = champions.map(async (champion: string) => {
    return await Fighter2021.updateOne({ name: champion }, { isChampion: true });
  });
    
  return Promise.all(championsMap);
};