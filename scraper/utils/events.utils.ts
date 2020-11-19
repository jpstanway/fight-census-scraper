export const createFighter = (obj: any) => {
  const fighter = {
    name: obj.text().trim(),
    link: ''
  }
  
  if (obj.find("a").length > 0) {
    fighter.link = obj.find("a")[0].attribs.href;
  }

  return fighter;
};