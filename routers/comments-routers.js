const {
	deleteCommentById,
	getCommentsById,
	postCommentById,
	updateCommentById,
} = require("../api/controllers/comments.controllers");

const commentsRouter = require("express").Router();

commentsRouter
.route("/:comment_id")
.delete(deleteCommentById)
.patch(updateCommentById)

commentsRouter
	.route("/:article_id/comments")
	.get(getCommentsById)
	.post(postCommentById);

module.exports = { commentsRouter };
