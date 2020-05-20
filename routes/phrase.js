const { Router } = require('express');
const checkAuth = require('../middlewares/checkAuth');
const DataBase = require('../services/db');
const Dictionary = require('../utils/dictionary');

const route = Router();
const db = new DataBase();
const dictionary = new Dictionary();

route.use(checkAuth);

route.post('/parts', (req, res) => {

  const dbData = db.get('parts');

  res.status(200).json({
    result: "Успешно",
    data: dbData
  });

});

route.post('/get/(:_id)?', ({ params }, res) => {
  const { _id } = params;

  let dbData = [];
  if (_id) {
    dbData = db.get('data', { _id });
  } else {
    dbData = db.get('data');
  }

  res.status(200).json({
    result: "Успешно",
    data: dbData
  });

});

route.post('/add', ({ body }, res) => {

  const { searchWord, stressIndex } = body;

  const stress = dictionary.getStress(searchWord, stressIndex);

  const data = db.add('data', {
    ...body,
    stress,
    hash: dictionary.hash(data.searchWord)
  })

  res.status(200).json({
    result: "Успешно",
    data
  });
});

route.post('/update/:_id', ({ params, body }, res) => {

  const { _id } = params;
  const { searchWord, stressIndex } = body;

  const stress = dictionary.getStress(searchWord, stressIndex);

  if (db.update('data', { _id }, { ...body, stress })) {
    res.status(200).json({
      result: "Успешно",
      id: _id
    });
    return;
  }

  res.status(404).json({
    error: `Фразы с id ${_id} не существует`
  });
});

route.post('/delete/:_id', ({ params }, res) => {

  const { _id } = params;

  if (db.delete('data', { _id })) {
    res.status(200).json({
      result: "Успешно",
      id: _id
    });
    return;
  }

  res.status(404).json({
    error: `Фразы с id ${_id} не существует`
  });
})

module.exports = route;