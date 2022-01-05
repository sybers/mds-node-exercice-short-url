const shortid = require("shortid");

const shortToOriginal = new Map();

const shorten = (url) => {
  const shortened = shortid.generate();
  shortToOriginal.set(shortened, url);

  return shortened;
};

const getOriginalURL = (shortened) => {
  return shortToOriginal.get(shortened);
};

module.exports = {
  shorten,
  getOriginalURL,
};
