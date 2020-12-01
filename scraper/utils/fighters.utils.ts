export const removeAccentsFromName = (name: string) => {
  const accents = 'ÀÁÂÃÄÅàáâãäåăÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëęðÇçćÐÌÍÎÏìíîïĽłÙÚÛÜùúûüÑñńřŠšţțŸÿýŽž';
  const accentsOut = "AAAAAAaaaaaaaOOOOOOOooooooEEEEeeeeeeCccDIIIIiiiiLlUUUUuuuuNnnrSsttYyyZz";
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