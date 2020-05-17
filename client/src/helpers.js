
export const getPhraseWithStress = (phrase, stressInd = 0) => {
  if (!phrase) {
    return '';
  }
  const splited = phrase.split('');
  splited.splice(stressInd + 1, 0, ['&#x301;']);
  return splited.join('');
}