
export const getPhraseWithStress = (phrase, stressInd = 0) => {
  if (!phrase) {
    return '';
  }
  const splited = phrase.split('');
  splited.splice(stressInd + 1, 0, ['&#x301;']);
  return splited.join('');
}

export const getRhymeById = (rhymeId, rhymes) => {
  const rhymesList = rhymeId.split(',');
  return rhymesList.reduce((acc, rhyme) => {
    //rhymes.filter(r => r.id === rhyme);
    const res = rhymes.filter(r => r.id === rhyme.trim());
    if (res.length) {
      return [...acc, res[0].name];
    }
    return acc;
  }, []).join(', ');
}

export const getPartByPrefix = (prefix, parts) => {
  return parts.filter(part => part.prefix === prefix)[0].name;
}