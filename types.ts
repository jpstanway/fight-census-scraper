export type Event = {
  id: number;
  title: string;
  link: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  matches?: Match[];
};

export type Match = {
  id: number;
  division: string;
  red: string;
  redLink: string | undefined;
  redStats?: FighterStats;
  blue: string;
  blueLink: string | undefined;
  blueStats?: FighterStats;
  result: string;
  round: string;
  time: string;
};

export type FighterStats = {
  height: string;
  weight: string;
  division: string;
  reach: string;
};