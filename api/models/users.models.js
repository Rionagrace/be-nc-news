const db = require("../../db/connection.js");
const format = require("pg-format");

function selectUsers(username) {
	let sql = `SELECT * FROM users;`;

	if (username) {
		sql = format(`SELECT * FROM users WHERE username = %L;`, [username]);
	}
	return db.query(sql).then((result) => {
		if (!result.rows.length) {
			return Promise.reject({
				status: 401,
				msg: `invalid user`,
			});
		}
		return result.rows;
	});
}


module.exports = { selectUsers };
