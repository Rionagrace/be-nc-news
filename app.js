const express = require("express");
const { getTopics, getEndPoints, getArticleById } = require("./api/controllers/topics.controllers.js");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndPoints)

app.get("/api/articles/:article_id", getArticleById)

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send({ msg: "Something went wrong" });
});

module.exports = app;
