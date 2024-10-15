const {
	selectArticleById,
	selectArticles,
	editArticleByID,
} = require("../models/articles.models.js");

function getArticleById(req, res, next) {
	const { article_id } = req.params;
	return selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => next(err));
}

function updateArticleById(req, res, next) {
	const { article_id } = req.params;
	const { body } = req;
	return editArticleByID(article_id, body)
	.then((article) => {
		res.status(200).send({ article })
	})
	.catch((err) => next(err))
}

function getArticles(req, res, next) {
	return selectArticles()
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch((err) => next(err));
}

module.exports = { getArticleById, getArticles, updateArticleById };
