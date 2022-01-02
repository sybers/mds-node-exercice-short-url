function isValidURL(string) {
  try {
    const url = new URL(string);
    return ["http", "https"].includes(url.protocol.slice(0, -1));
  } catch (error) {
    return false;
  }
}

module.exports = {
  isValidURL,
};
