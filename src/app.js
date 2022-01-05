const express = require("express");
const path = require("path");

const urlShortener = require("./lib/urlShortener");
const { isValidURL } = require("./lib/util");

const app = express();

app.set("view engine", "pug");
app.set("views", path.resolve(__dirname, "..", "views"));

app.use((req, res, next) => {
  res.generateURL = (path) => `${req.protocol}://${req.get("host")}${path}`;

  next();
});

// handle POST body
app.use(express.urlencoded({ extended: false }));

// render form to send URL to shorten
app.get("/", (_req, res) => {
  res.render("index");
});

// post original URL and return the short version
app.post("/", (req, res) => {
  const { url } = req.body;
  if (!url || !isValidURL(url)) return res.status(400).end();

  const shortURLID = urlShortener.shorten(url);
  const shortURL = res.generateURL(`/${shortURLID}`);

  res.render("short-url", {
    originalURL: url,
    shortURL: shortURL,
  });
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

// serve all files inside the public folder
app.use("/", express.static(path.resolve(__dirname, "..", "public")));

// generic 404 error page
app.use((_req, res) => {
  res.status(404).render("errors/404");
});

// global error handler
app.use((err, _req, res, next) => {
  console.error(err);
  next(err);
});

app.use((err, _req, res, _next) => {
  res.status(500).send("500 Internal Server Error");
});

module.exports = app;
