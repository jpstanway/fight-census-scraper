export type Event = {
  title: string;
  link: string;
  date: Date;
  venue: string;
  city: string;
  country: string;
};

export type Match = {
  event: string;
  division: string;
  red: Fighter;
  blue: Fighter;
  result: string;
  round: string;
  time: string;
};

export type Fighter = {
  name: string;
  link: string | undefined;
  height?: string;
  weight?: string;
  division?: string;
  reach?: string;
};