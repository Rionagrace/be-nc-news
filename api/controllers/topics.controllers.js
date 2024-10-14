const { selectTopics, selectEndPoints } = require("../models/topics.models");
const endPoints = require("../../endpoints.json");

function getTopics(req, res, next) {
	return selectTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch((err) => next(err));
}

function getEndPoints(req, res, next) {
	return res
		.status(200)
		.send({ endPoints })
		.catch((err) => next(err));
}

module.exports = { getTopics, getEndPoints };
