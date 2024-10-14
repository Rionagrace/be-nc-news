const express = require("express");
const { getTopics, getEndPoints, getArticleById, getArticles, getCommentsById } = require("./api/controllers/topics.controllers.js");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndPoints)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsById)

app.use((err, req, res, next) => {
  if(err.code === '22P02'){
    res.status(400).send({msg: "Bad request"})
  } else next(err)
})

app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else next(err);
});

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send({ msg: "Something went wrong" });
});

module.exports = app;
