const db = require("../../db/connection.js");
const format = require("pg-format");

function selectTopics() {
	const sql = `SELECT * FROM topics`;

	return db.query(sql).then((result) => {
		return result.rows;
	});
}

function selectArticleById(article_id) {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
		.then((result) => {
			if (!result.rows.length) {
				return Promise.reject({
					status: 404,
					msg: `Article not found`,
				});
			}
			return result.rows[0];
		});
}

module.exports = { selectTopics, selectArticleById };
