const { Router } = require('express');
const DataBase = require('../services/db');
const Dictionary = require('../utils/dictionary');

const route = Router();
const db = new DataBase();
const dictionary = new Dictionary();

route.post('/getParts', (req, res) => {
  const dbData = db.get('parts');

  res.status(200).json({
    result: "Успешно",
    data: dbData
  });

});

route.post('/getVariants', (req, res) => {
  const dbData = db.get('variants');

  res.status(200).json({
    result: "Успешно",
    data: dbData
  });
});

route.post('/searchRhyme', ({ body }, res) => {

  const { searchWord, rhymeList } = body;

  const rhymes = dictionary.searchRhymes(searchWord, rhymeList);

  res.status(200).json({
    result: "Успешно",
    data: rhymes
  });
});

route.post('/update', (_, res) => {

  const dbData = db.get('data');

  dbData.map(data => {
    db.update('data', { _id: data._id }, {
      ...data,
      stress: dictionary.getStress(data.searchWord, data.stressIndex),
      hash: dictionary.hash(data.searchWord)
    });

  });

  res.status(200).json({
    data: true
  });

});

module.exports = route;