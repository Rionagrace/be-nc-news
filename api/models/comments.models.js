const db = require("../../db/connection.js");
const format = require("pg-format");

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
			status: 400,
			msg: "missing either username or body",
		});
	}
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
		.then((result) => {
			const article_id = result.rows[0]?.article_id;
			if (!article_id) {
				return Promise.reject({
					status: 404,
					msg: "article not found",
				});
			}
			return db
				.query(
					`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
					[comment.username, comment.body, article_id]
				)
				.then((result) => {
					return result.rows[0];
				});
		});
}

module.exports = { selectCommentsById, insertCommentById };
