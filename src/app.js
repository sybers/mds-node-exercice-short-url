const express = require("express");
const fs = require("fs");
const path = require("path");

const urlShortener = require("./lib/urlShortener");
const { replaceVariables, isValidURL } = require("./lib/util");

const publicPath = path.resolve(__dirname, "..", "public");

const app = express();

app.use((req, res, next) => {
  res.generateURL = (path) => `${req.protocol}://${req.get("host")}${path}`;

  next();
});

// handle POST body
app.use(express.urlencoded({ extended: false }));

// render form to send URL to shorten
app.get("/", (_req, res, next) => {
  fs.readFile(path.join(publicPath, "index.html"), (err, data) => {
    if (err) return next(err);

    res.write(data);
    res.end();
  });
});

// post original URL and return the short version
app.post("/", (req, res, next) => {
  const { url } = req.body;
  if (!url || !isValidURL(url)) return res.status(400).end();

  const shortURLID = urlShortener.shorten(url);
  const shortURL = res.generateURL(`/${shortURLID}`);

  fs.readFile(
    path.join(publicPath, "short-url.html"),
    "utf-8",
    (err, pageTemplate) => {
      if (err) return next(err);

      const page = replaceVariables(pageTemplate, {
        ORIGINAL_URL: url,
        SHORT_URL: shortURL,
      });

      res.send(page);
    }
  );
});

// redirect a short URL to its original location
app.get("/:shortURLID", (req, res, next) => {
  const { shortURLID } = req.params;
  const originalURL = urlShortener.getOriginalURL(shortURLID);

  // original URL not found, this middleware cannot handle this request.
  if (!originalURL) return next();

  // if there is a matching original URL, redirect the request to it
  res.redirect(originalURL);
});

// generic 404 error page
app.use((_req, res) => {
  fs.readFile(path.join(publicPath, "errors", "404.html"), (err, data) => {
    res.status(404);
    if (err) {
      res.send("404 Page Not Found");
    } else {
      res.write(data);
      res.end();
    }
  });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.send("500 Internal Server Error");
});

module.exports = app;
