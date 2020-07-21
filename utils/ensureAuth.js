const jwt = require('jsonwebtoken');
const util = require('util');
const User = require('../models/user');

const verifyJWTPromise = util.promisify(jwt.verify);

const isUserLoggedIn = (req, res, next) => {
  let token = req.cookies.userId;

  if (typeof token === 'undefined') {
    return res.status(401).send('No entry ahead');
  }

  verifyJWTPromise(token, process.env.SECRET)
    .then(({ id }) => User.findById(id))
    .then(user => {
      if(user) {
        req.user = user;
        return next();
      }
      return res.status(401).send('No entry ahead');
    })
    .catch(() => res.status(401).send('No entry ahead'));
};

const isAdminLoggedIn = (req, res, next) => {
  let token = req.cookies.userId;

  if (typeof token === 'undefined') {
    return res.status(401).send('No entry ahead');
  }

  verifyJWTPromise(token, process.env.SECRET)
    .then(({ id }) => User.findById(id))
    .then(user => {
      if (user.role === 'admin') {
        req.user = user;
        return next();
      }
      return res.status(401).send('No entry ahead');
    })
    .catch(() => res.status(401).send('No entry ahead'));
};

module.exports = { isUserLoggedIn, isAdminLoggedIn };