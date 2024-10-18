const db = require("../../db/connection.js");
const format = require("pg-format");

function selectTopics() {
	const sql = `SELECT * FROM topics`;

	return db.query(sql).then((result) => {
		return result.rows;
	});
}

function checkTopicExists(topic) {
	const sql = format(`SELECT * FROM topics WHERE slug = %L`, topic);

	return db.query(sql).then((result) => {
		if (!result.rows.length) {
			return Promise.reject({
				status: 401,
				msg: "invalid topic",
			});
		}
		return result.rows;
	});
}

function insertTopic(body){

	if(!body.slug || !body.description){
		return Promise.reject({
			status: 401,
			msg: "missing topic or description"
		})
	}
	
	return db.query(`INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`, [body.slug, body.description])
	.then((result) => {
		return result.rows[0]
	})
}
module.exports = {
	selectTopics,
	checkTopicExists, insertTopic
};
