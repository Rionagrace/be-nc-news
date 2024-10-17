const db = require("../../db/connection.js");
const format = require("pg-format");
const { selectTopics, checkTopicExists } = require("./topics.models.js");
const { selectUsers } = require("./users.models.js");

function selectArticleById(article_id) {
	return db
		.query(
			`SELECT 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
		articles.body,
    articles.created_at, 
    articles.votes, 
    articles.article_img_url, 
    COUNT(comments.article_id) AS comment_count
FROM 
    articles
LEFT JOIN 
    comments 
ON 
    articles.article_id = comments.article_id
		WHERE articles.article_id = $1 GROUP BY 
    articles.article_id`,
			[article_id]
		)
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

function selectArticles(
	sort_by = "created_at",
	order = "desc",
	topic,
	limit = 10,
	page = 1
) {
	if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
		return Promise.reject({
			status: 400,
			msg: "Invalid limit or page query",
		});
	}
	const offset = (page - 1) * limit;
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
		(SELECT COUNT(*) FROM articles) AS article_count,
    COUNT(comments.article_id) AS comment_count
FROM 
    articles
LEFT JOIN 
    comments 
ON 
    articles.article_id = comments.article_id`;

	const filterByTopic = format(` WHERE topic = %L`, topic);

	const groupBy = ` GROUP BY 
    articles.article_id`;

	const orderBy = format(
		` ORDER BY 
    %s %s`,
		sort_by,
		order
	);

	const limitBy = format(` LIMIT %s OFFSET %s`, limit, offset);

	const fullSql =
		sql + (topic ? filterByTopic : "") + groupBy + orderBy + limitBy;

	if (topic) {
		return checkTopicExists(topic)
			.then((result) => {
				if (!result.length) {
					return Promise.reject({
						status: 404,
						msg: "topic not found",
					});
				}
				return db.query(fullSql);
			})
			.then((result) => {
				return result.rows;
			});
	}
	return db.query(fullSql).then((result) => {
		return result.rows;
	});
}

function insertArticle(body) {
	if (!body.topic || !body.author || !body.body || !body.title)
		return Promise.reject({
			status: 401,
			msg: "missing one or more elements",
		});

	return selectUsers(body.author)
		.then(() => {
			return checkTopicExists(body.topic);
		})
		.then((output) => {
			return db.query(
				`INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *;`,
				[body.author, body.title, body.body, body.topic]
			);
		})
		.then((article) => {
			return selectArticleById(article.rows[0].article_id).then((article) => {
				return article;
			});
		});
}

module.exports = {
	selectArticleById,
	selectArticles,
	editArticleByID,
	insertArticle,
};
