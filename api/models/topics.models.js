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
		return result.rows;
	});
}





module.exports = {
	selectTopics, checkTopicExists
};
