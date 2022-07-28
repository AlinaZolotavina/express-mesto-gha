module.exports.validateUrl = (url) => {
  // eslint-disable-next-line no-useless-escape
  const regex = /^(https?:\/\/)(w{3})?([\da-z\.\-]+)\.([a-z\.]{2,6})([\w\.\-\_~:\/?#\[\]@!$&\'()*\+,;=])*#?\/?$/;
  if (regex.test(url)) {
    return url;
  }
  throw new Error('Некорректная ссылка на картинку');
};
