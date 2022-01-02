function replaceVariables(pageContents, variables) {
  return pageContents.replace(
    /\${([A-Z_]+)}/g,
    (match, parameter) => variables[parameter] ?? match
  );
}

function isValidURL(string) {
  try {
    const url = new URL(string);
    return ["http", "https"].includes(url.protocol.slice(0, -1));
  } catch (error) {
    return false;
  }
}

module.exports = {
  replaceVariables,
  isValidURL,
};
