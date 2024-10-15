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

function editArticleByID(article_id, body) {
	if (!body.inc_votes) {
		return Promise.reject({
			status: 401,
			msg: "no votes to patch",
		});
	}

	return selectArticleById(article_id)
		.then(() => {
			return db.query(
				`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
				[body.inc_votes, article_id]
			);
		})
		.then((result) => {
			return result.rows[0];
		});
}

function selectArticles(sort_by = "created_at", order = "desc", topic) {
	const allowed = {
		sort_by: [
			"author",
			"title",
			"article_id",
			"topic",
			"created_at",
			"votes",
			"comment_count",
		],
		order: ["asc", "ASC", "desc", "DESC"],
	};

	if (!allowed.sort_by.includes(sort_by) || !allowed.order.includes(order)) {
		return Promise.reject({ status: 400, msg: "bad request" });
	}

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
LEFT JOIN 
    comments 
ON 
    articles.article_id = comments.article_id`

		const filterByTopic = format(` WHERE topic = %L`, topic)

		const orderBy = format(` ORDER BY 
    %s %s;`, sort_by, order);

		const groupBy = ` GROUP BY 
    articles.article_id`;

		const fullSql = sql + (topic ? filterByTopic : "") + groupBy + orderBy

	return db.query(fullSql).then((result) => {
		if(!result.rows.length){
			return Promise.reject({
				status: 404,
				msg: "articles not found"
			})
		}

		return result.rows;
	});
}

module.exports = { selectArticleById, selectArticles, editArticleByID };
