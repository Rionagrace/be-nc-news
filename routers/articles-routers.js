const {
	getArticleById,
	updateArticleById,
	getArticles,
	postArticle,
	deleteArticle,
} = require("../api/controllers/articles.controllers");
const { commentsRouter } = require("./comments-routers");

const articlesRouter = require("express").Router();

articlesRouter
	.route("/:article_id")
	.get(getArticleById)
	.patch(updateArticleById)
	.delete(deleteArticle)

articlesRouter.route("/")
.get(getArticles)
.post(postArticle)

articlesRouter.use("/", commentsRouter);

module.exports = { articlesRouter };
