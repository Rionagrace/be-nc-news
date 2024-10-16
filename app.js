const express = require("express");
const { getTopics } = require("./api/controllers/topics.controllers.js");
const {
	getArticles,
	getArticleById,
	updateArticleById,
} = require("./api/controllers/articles.controllers.js");
const {
	getCommentsById,
	postCommentById,
	deleteCommentById,
} = require("./api/controllers/comments.controllers.js");

const { apiRouter } = require("./routers/api-routers");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
	if (err.code === "22P02") {
		res.status(400).send({ msg: "Bad request" });
	} else next(err);
});

app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else next(err);
});

app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: "Something went wrong" });
});

module.exports = app;
