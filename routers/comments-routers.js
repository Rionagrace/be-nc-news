const {
	deleteCommentById,
	getCommentsById,
	postCommentById,
} = require("../api/controllers/comments.controllers");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(deleteCommentById);

commentsRouter
	.route("/:article_id/comments")
	.get(getCommentsById)
	.post(postCommentById);

module.exports = { commentsRouter };
