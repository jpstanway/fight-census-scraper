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

export const createFighter = (obj: any) => {
    const fighter = {
      name: obj.text().replace(/\*/g, "").trim(),
      link: ''
    };
    
    if (obj.find("a").length > 0) {
      fighter.link = obj.find("a")[0].attribs.href;
    }
  
    return fighter;
  };