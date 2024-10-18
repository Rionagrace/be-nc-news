const db = require("../../db/connection.js");
const format = require("pg-format");
const { selectArticleById } = require("./articles.models.js");
const { articleData } = require("../../db/data/test-data/index.js");
const { selectUsers } = require("./users.models.js");

function selectCommentsById(article_id, limit = 10, p = 1) {

	if(isNaN(article_id)){
		return Promise.reject({
			status: 400,
			msg: "Bad request"
		})
	}

	if (isNaN(limit) || isNaN(p) || limit <= 0 || p <= 0) {
		return Promise.reject({
			status: 400,
			msg: "Invalid limit or page query",
		});
	}

	const offset = (p - 1) * limit;
	const sql = format(`
  SELECT * 
  FROM comments 
  WHERE article_id = %s 
  ORDER BY comments.created_at DESC
	LIMIT %s OFFSET %s`, article_id, limit, offset);


	return db.query(sql).then((result) => {
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

function editCommentByCommentId(comment_id, body){
	if (!body.inc_votes) {
		return Promise.reject({
			status: 401,
			msg: "no votes to patch",
		});
	}

	return selectCommentByCommentId(comment_id)
	.then((comment) => {

		return db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`, [body.inc_votes, comment_id])
	})
	.then((result) => {
		return result.rows[0]
	})
}


module.exports = { selectCommentsById, insertCommentById, removeCommentById,editCommentByCommentId };
