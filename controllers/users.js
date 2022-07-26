/* eslint-disable no-unused-vars */
const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const statusCodes = require('../utils/statusCodes');

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(statusCodes.default).send({ message: 'Произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(statusCodes.notFound).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCodes.badRequest).send({ message: 'Некорректный id пользователя' });
        return;
      }
      res.status(statusCodes.default).send({ message: 'Произошла ошибка' });
    });
};

const getMe = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(statusCodes.notFound).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCodes.badRequest).send({ message: 'Некорректный id пользователя' });
        return;
      }
      res.status(statusCodes.default).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.status(statusCodes.created).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusCodes.badRequest).send({ message: 'Введенные данные некорректны' });
        return;
      }
      res.status(statusCodes.default).send({ message: 'Произошла ошибка' });
    });
};

const updateUserProfile = ((req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(statusCodes.notFound).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(statusCodes.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusCodes.badRequest).send({ message: 'Введенные данные некорректны' });
        return;
      }
      res.status(statusCodes.default).send({ message: 'Произошла ошибка' });
    });
});

const updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(statusCodes.notFound).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(statusCodes.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusCodes.badRequest).send({ message: 'Некорректная ссылка на картинку' });
        return;
      }
      res.status(statusCodes.default).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  login,
  getUsers,
  getUserById,
  getMe,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
