const {
	getArticleById,
	updateArticleById,
	getArticles,
} = require("../api/controllers/articles.controllers");
const { commentsRouter } = require("./comments-routers");

const articlesRouter = require("express").Router();

articlesRouter
	.route("/:article_id")
	.get(getArticleById)
	.patch(updateArticleById);

articlesRouter.get("/", getArticles);

articlesRouter.use("/", commentsRouter);

module.exports = { articlesRouter };
