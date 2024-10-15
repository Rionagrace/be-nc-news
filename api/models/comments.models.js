const db = require("../../db/connection.js");
const format = require("pg-format");
const { selectArticleById } = require("./articles.models.js");
const { articleData } = require("../../db/data/test-data/index.js");
const { selectUsers } = require("./users.models.js");

function selectCommentsById(article_id) {
	const sql = `
  SELECT * 
  FROM comments 
  WHERE article_id = $1 
  ORDER BY comments.created_at DESC;`;

	return db.query(sql, [article_id]).then((result) => {
		if (!result.rows.length) {
			return Promise.reject({
				status: 404,
				msg: `Author id does not exist`,
			});
		}
		return result.rows;
	});
}

function insertCommentById(article_id, comment) {
	if (!comment.username || !comment.body) {
		return Promise.reject({
			status: 401,
			msg: "missing either username or body",
		});
	}
	return selectUsers(comment.username)
		.then(() => {
			return selectArticleById(article_id);
		})
		.then(() => {
			return db.query(
				`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
				[comment.username, comment.body, article_id]
			);
		})
		.then((result) => {
			return result.rows[0];
		});
}

function removeCommentById(comment_id) {
	return selectCommentByCommentId(comment_id)
		.then(() => {
			return db.query(`DELETE FROM comments WHERE comment_id = $1`, [
				comment_id,
			]);
		})
		.then((result) => {
			return result.rows;
		});
}

function selectCommentByCommentId(comment_id) {
	const sql = `
  SELECT * 
  FROM comments 
  WHERE comment_id = $1;`;

	return db.query(sql, [comment_id]).then((result) => {
		if (!result.rows.length) {
			return Promise.reject({
				status: 404,
				msg: `comment does not exist`,
			});
		}
		return result.rows;
	});
}


module.exports = { selectCommentsById, insertCommentById, removeCommentById,  };
