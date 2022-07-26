const Card = require('../models/card');
const statusCodes = require('../utils/statusCodes');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(statusCodes.default).send({ message: 'Произошла ошибка' }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(statusCodes.notFound).send({ message: 'Карточка не найдена' });
        return;
      }
      if (card.owner !== req.user_id) {
        res.status(statusCodes.forbidden).send({ message: 'Нельзя удалить карточку другого пользователя' });
      }
      res.status(statusCodes.OK).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCodes.badRequest).send({ message: 'Некорректный id карточки' });
        return;
      }
      res.status(statusCodes.default).send({ message: 'Произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(statusCodes.created).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusCodes.badRequest).send({ message: 'Введенные данные некорректны' });
        return;
      }
      res.status(statusCodes.default).send({ message: 'Произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(statusCodes.notFound).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCodes.badRequest).send({ message: 'Некорректный id карточки' });
        return;
      }
      res.status(statusCodes.default).send({ message: 'Произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(statusCodes.notFound).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCodes.badRequest).send({ message: 'Некорректный id карточки' });
        return;
      }
      res.status(statusCodes.default).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
