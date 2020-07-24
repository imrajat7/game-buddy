const jwt = require('jsonwebtoken');
const util = require('util');
const User = require('../models/user');

const verifyJWTPromise = util.promisify(jwt.verify);

const isUserLoggedIn = (req, res, next) => {
  let token = req.cookies.userId;

  if (typeof token === 'undefined') {
    return res.redirect('/auth/sendOTP');
  }

  verifyJWTPromise(token, process.env.SECRET)
    .then(({ id }) => User.findById(id))
    .then(user => {
      if (user) {
        req.user = user;
        return next();
      }
      return res.redirect('/auth/sendOTP');
    })
    .catch(() => res.redirect('/auth/sendOTP'));
};

isUserVerified = (req, res, next) => {
  if(req.user.isRegistered) {
    next();
  } else {
    res.redirect('/user/moreDetails');
  }
}

const isAdminLoggedIn = (req, res, next) => {
  let token = req.cookies.userId;

  if (typeof token === 'undefined') {
    return res.status(401).send('You are not admin!');
  }

  verifyJWTPromise(token, process.env.SECRET)
    .then(({ id }) => User.findById(id))
    .then(user => {
      if (user.role === 'admin') {
        req.user = user;
        return next();
      }
      return res.status(401).send('You are not admin!');
    })
    .catch(() => res.status(401).send('You are not admin!'));
};

const authMiddleware = (req, res, next) => {
  req.user = undefined;
  let token = req.cookies.userId;

  if (typeof token === 'undefined') {
    return next();
  }

  verifyJWTPromise(token, process.env.SECRET)
    .then(({ id }) => User.findById(id))
    .then(user => {
      if (user) {
        req.user = user;
      }
      return next();
    })
    .catch(() => res.redirect('/auth/sendOTP'));
};


module.exports = { isUserLoggedIn, isAdminLoggedIn, authMiddleware };