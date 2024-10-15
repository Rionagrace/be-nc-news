const db = require("../../db/connection.js");
const format = require("pg-format");

function validateUsername(username) {
	return db
		.query(format(`SELECT * FROM users WHERE username = %L;`, [username]))
		.then((result) => {
			if (!result.rows.length) {
				return Promise.reject({
					status: 401,
					msg: `invalid user`,
				});
			}
			return result.rows[0];
		});
}

module.exports = {validateUsername}