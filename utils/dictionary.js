
class Dictionary {

  vowels = ["а", "е", "ё", "и", "о", "у", "ы", "э", "ю", "я"];
  consonant = ["б", "в", "г", "д", "ж", "з", "й", "к", "л", "м", "н", "п", "р", "с", "т", "ф", "х", "ц", "ч", "ш", "щ", "ь", "ъ"];

  hash = (phrase) => {
    return phrase.toLowerCase().split('').map(word => {
      return this.vowels.includes(word) ? 1 : (this.consonant.includes(word) ? 0 : 2)
    }).join('')
  }

  getStress = (phrase, stressInd) => {
    const hash = this.hash(phrase);

    return hash.toString().split('').reduceRight((count, item, index, arr) => {
      const startIndex = arr.length - index - 1
      if (item === "1" && startIndex >= stressInd) {
        return count + 1
      }
      return count
    }, 0);
  }

}

module.exports = Dictionary;