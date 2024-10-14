const db = require("../../db/connection.js");

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

module.exports = {selectCommentsById}