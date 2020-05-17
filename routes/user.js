const { Router } = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const DataBase = require('../services/db');

const route = Router();
const db = new DataBase();

route.post('/create', ({ body }, res) => {

  const { login, password } = body;
  const result = db.get('users', { login });
  if (!!result.length) {
    return res.status(401).json({ error: 'Пользователь с таким логином уже существует' })
  }

  db.add('users', { login, password });
  res.status(200).json({ result: 'Пользователь успешно создан' });

});

route.post('/auth', ({ body }, res) => {

  const { login, password } = body;
  const secret = config.get('SECRET');

  const result = db.get('users', { login, password });

  if (!!result.length) {
    const token = jwt.sign({ login, id: result._id }, secret, {
      expiresIn: '10h'
    });

    res.status(200).json({
      token,
      result: "Успешная авторизация",
      userId: result._id
    });

    return;
  }

  res.status(403).json({
    error: "Неверный логин или пароль"
  });
});

module.exports = route;