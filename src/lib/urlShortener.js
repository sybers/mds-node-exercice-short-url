const shortid = require("shortid");

const originalToShort = new Map();
const shortToOriginal = new Map();

const shorten = (url) => {
  if (originalToShort.has(url)) {
    return originalToShort.get(url);
  }

  const shortened = shortid.generate();
  originalToShort.set(url, shortened);
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
