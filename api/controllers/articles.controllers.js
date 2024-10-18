const {
	selectArticleById,
	selectArticles,
	editArticleByID,
	insertArticle,
	removeArticle,
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
			res.status(200).send({ article });
		})
		.catch((err) => next(err));
}

function getArticles(req, res, next) {
	const { sort_by, order, topic, limit, p } = req.query;
	return selectArticles(sort_by, order, topic, limit, p)
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch((err) => next(err));
}

function postArticle(req, res, next) {
	const { body } = req;
	return insertArticle(body)
		.then((article) => {
			res.status(201).send({ article });
		})
		.catch((err) => next(err));
}

function deleteArticle(req, res, next){

	const {article_id} = req.params
	return removeArticle(article_id)
	.then((article) => {
		res.status(204).send("")
	})
	.catch((err) => next(err));

}
module.exports = {
	getArticleById,
	getArticles,
	updateArticleById,
	postArticle,
	deleteArticle
};
