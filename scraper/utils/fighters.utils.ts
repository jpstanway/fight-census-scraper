export const removeAccentsFromName = (name: string) => {
  const accents = 'ÁÀÁÂÃÄÅàáâãäåăÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëęðÇçćÐÌÍÎÏìíîïĽłÙÚÛÜùúûüÑñńřŠšţțŸÿýŽž';
  const accentsOut = "AAAAAAAaaaaaaaOOOOOOOooooooEEEEeeeeeeCccDIIIIiiiiLlUUUUuuuuNnnrSsttYyyZz";
  let textNoAccents: string[] = [];

    for (let i = 0; i < name.length; i++) { 
        let idx = accents.indexOf(name[i]);
        if (idx != -1)
            textNoAccents[i] = accentsOut.substr(idx, 1);
        else
            textNoAccents[i] = name[i];
    }

    const formatted = textNoAccents.join('');
    return formatted.replace(/\./g, "");
};

export const createFighter = (obj: any, division: string) => {
    const fighter = {
      name: obj.text().replace(/\(.*\)|\*/gi, "").trim(),
      division,
      link: ''
    };
    
    if (obj.find("a").length > 0) {
      fighter.link = obj.find("a")[0].attribs.href;
    }
  
    return fighter;
};

export const convertCatchweight = (division: string) => {
    const regex = /[^0-9.]/gi;
    let weight = parseInt(division.replace(regex, ""));

    if (weight > 115 && weight < 125) return "Women's Strawweight";
    if (weight > 125 && weight < 135) return "Flyweight";
    if (weight > 135 && weight < 145) return "Bantamweight";
    if (weight > 145 && weight < 155) return "Featherweight";
    if (weight > 155 && weight < 170) return "Lightweight";
    if (weight > 170 && weight < 186) return "Welterweight";
    if (weight > 185 && weight < 205) return "Middleweight";
    if (weight > 205 && weight < 215) return "Light Heavyweight";
    if (weight > 215) return "Heavyweight";

    return division;
};