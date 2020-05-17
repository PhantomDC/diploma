const jwt = require('jsonwebtoken');

const checkAuth = ({ headers }, res, next) => {
  const token = headers['authorization'].replace('Bearer ', '');

  try {
    jwt.verify(token, require('config').get('SECRET'));
    next();
  } catch (e) {
    res.status(401).json({
      error: "Not authorized"
    });
  };
}

module.exports = checkAuth;