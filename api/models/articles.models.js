const db = require("../../db/connection.js");
const format = require("pg-format");

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

function selectArticles() {
	const sql = `SELECT 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url, 
    COUNT(comments.article_id) AS comment_count
FROM 
    articles
INNER JOIN 
    comments 
ON 
    articles.article_id = comments.article_id
GROUP BY 
    articles.article_id 
ORDER BY 
    articles.created_at DESC;`;

	return db.query(sql).then((result) => {
		return result.rows;
	});
}

module.exports = { selectArticleById, selectArticles };
