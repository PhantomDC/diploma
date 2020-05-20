const DataBase = require('../services/db');
const db = new DataBase();

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
    const splited = hash.toString().trim().split('');

    return splited.reduceRight((count, item, index) => {
      if (item === "1" && index > stressInd) {
        return count + 1
      }
      return count
    }, 0);
  }

  getPreviousConsonant = ({ searchWord, stressIndex, hash }) => {
    return hash.slice(0, stressIndex).split('').reduceRight((acc, item, index) => {
      return !acc && item === '0' ? searchWord[index] : acc;
    }, null).toLowerCase();
  }

  searchRhymes = (phrase, variantList) => {
    const searchRhyme = this.searchRhymeByVariant(phrase);
    return variantList.reduce((result, variant) => {
      const resVariant = searchRhyme(variant);
      return [...result, ...resVariant];
    }, [])
      .reduce((result, item) => {
        let lastInd = false;

        const flag = result.some((r, ind) => {
          if (r.phrase.searchWord === item.phrase.searchWord) {
            lastInd = ind;
            return true;
          }
          return false;
        });

        if (flag) {
          result[lastInd] = {
            ...result[lastInd],
            rhyme: `${result[lastInd].rhyme || ''}, ${item.rhyme}`
          }
        } else {
          result.push(item);
        }

        return result;

      }, []);
  }

  searchRhymeByVariant = searchWord => {
    const dbData = db.get('data');
    const filteredDbData = dbData.filter(data => data.searchWord.toLowerCase() !== searchWord.toLowerCase());
    const phrase = dbData.filter(data => data.searchWord.toLowerCase() === searchWord.toLowerCase())[0];

    return variant => {

      return filteredDbData.reduce((result, item) => {
        const stressVowel = phrase.searchWord[phrase.stressIndex];
        const itemStressVowel = item.searchWord[item.stressIndex];

        if (item.stress !== phrase.stress || stressVowel !== itemStressVowel) return result;

        switch (variant) {
          case 'accurat':
            if (phrase.searchWord.slice(phrase.stressIndex).toLowerCase() === item.searchWord.slice(item.stressIndex).toLowerCase()) {
              result.push({
                rhyme: "accurat",
                phrase: item,
              });
            }
            break;
          case 'approximate':
            if (phrase.searchWord.slice(phrase.stressIndex).toLowerCase() !== item.searchWord.slice(item.stressIndex).toLowerCase()) {
              result.push({
                rhyme: "approximate",
                phrase: item,
              });
            }
            break;
          case 'rich':
            if (this.getPreviousConsonant(phrase) === this.getPreviousConsonant(item)) {
              result.push({
                rhyme: "rich",
                phrase: item,
              });
            }

            break;

          case 'poor':
            if (this.getPreviousConsonant(phrase) !== this.getPreviousConsonant(item)) {
              result.push({
                rhyme: "poor",
                phrase: item,
              });
            }

            break;

          case 'uniform':
            if (phrase.part === item.part) {
              result.push({
                rhyme: "uniform",
                phrase: item,
              });
            }

            break;

          case 'dissimilar':
            if (phrase.part !== item.part) {
              result.push({
                rhyme: "dissimilar",
                phrase: item,
              });
            }

            break;

        }

        return result;
      }, [])



    }
  }
}

module.exports = Dictionary;