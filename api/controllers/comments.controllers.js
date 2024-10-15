const { selectCommentsById, insertCommentById } = require("../models/comments.models");

function getCommentsById(req, res, next) {
	const { article_id } = req.params;
	return selectCommentsById(article_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch((err) => next(err));
}

function postCommentById(req, res, next){
  const { article_id } = req.params;
  const {body} = req
  return insertCommentById(article_id, body)
  .then((comment) => {
    res.status(201).send({comment})
  })
  .catch((err) => next(err))


}

module.exports = { getCommentsById, postCommentById };
