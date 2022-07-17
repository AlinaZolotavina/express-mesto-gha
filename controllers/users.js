/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
const User = require('../models/user');
const statusCodes = require('../utils/statusCodes');

const getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    res.send({ data: users })
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
    res.send({ data: user });
  })
  .catch((err) => {
    res.status(statusCodes.default).send({ message: 'Произошла ошибка' });
  });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
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
    res.status(statusCodes.OK).send({ data: user, message: 'Данные обновлены' });
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
    res.status(statusCodes.OK).send({ data: user, message: 'Аватар обновлен' });
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
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
