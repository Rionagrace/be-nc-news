const {
	selectTopics,
	selectArticleById,
  selectArticles,
  selectCommentsById,
} = require("../models/topics.models");
const endPoints = require("../../endpoints.json");

function getTopics(req, res, next) {
	return selectTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch((err) => next(err));
}

function getEndPoints(req, res, next) {
	return res.status(200).send({ endPoints });
}

function getArticleById(req, res, next) {
	const { article_id } = req.params;
	return selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => next(err));
}

function getArticles(req, res, next) {
  return selectArticles()
  .then((articles) => {
    res.status(200).send({articles})
  })
  .catch((err) => next(err))
}

function getCommentsById(req, res, next) {
  const { article_id } = req.params;
  return selectCommentsById(article_id)
  .then((comments) => {
    res.status(200).send({comments})
  })
  .catch((err) => next(err))

}

module.exports = { getTopics, getEndPoints, getArticleById, getArticles, getCommentsById };
