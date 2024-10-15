const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const index = require("../db/data/test-data/index.js");
const endPoints = require("../endpoints.json");

beforeEach(() => seed(index));
afterAll(() => {
	db.end();
});

describe("/api/topics", () => {
	test("GET 200 responds with all topics", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then((response) => {
				expect(Array.isArray(response.body.topics)).toBe(true);
				expect(response.body.topics.length).toBe(3);
				response.body.topics.forEach((topic) => {
					expect(typeof topic.description).toBe("string");
					expect(typeof topic.slug).toBe("string");
				});
			});
	});
});

describe("/api", () => {
	test("returns 200 and documents all other endpoints available.", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				expect(body.endPoints).toEqual(endPoints);
			});
	});
});

describe("/api/articles/:article_id", () => {
	describe("GET", () => {
		test("returns 200 and the specified article", () => {
			return request(app)
				.get("/api/articles/1")
				.expect(200)
				.then(({ body }) => {
					expect(body.article.title).toBe(
						"Living in the shadow of a great man"
					);
					expect(body.article.topic).toBe("mitch");
					expect(body.article.body).toBe("I find this existence challenging");
					expect(body.article.article_id).toBe(1);
					expect(body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
					expect(body.article.votes).toBe(100);
					expect(body.article.article_img_url).toBe(
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
					);
				});
		});
		test("returns 400 when request has incorrect format", () => {
			return request(app)
				.get("/api/articles/hello")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad request");
				});
		});
		test("returns 404 when valid but non-existant id requested", () => {
			return request(app)
				.get("/api/articles/34567")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Article not found");
				});
		});
	});
	describe("PATCH", () => {
		test("200 and returns with updated article", () => {
			return request(app)
				.patch("/api/articles/1")
				.send({ inc_votes: 1 })
				.expect(200)
				.then(({ body }) => {
					expect(body.article.title).toBe(
						"Living in the shadow of a great man"
					);
					expect(body.article.topic).toBe("mitch");
					expect(body.article.body).toBe("I find this existence challenging");
					expect(body.article.article_id).toBe(1);
					expect(body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
					expect(body.article.article_img_url).toBe(
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
					);
					expect(body.article.votes).toBe(101);
				});
		});
		test("returns 404 when valid but non-existant id requested", () => {
			return request(app)
				.patch("/api/articles/34567")
				.send({ inc_votes: 1 })
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Article not found");
				});
		});
		test("returns 400 when invalid id requested", () => {
			return request(app)
				.patch("/api/articles/hello")
				.send({ inc_votes: 1 })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad request");
				});
		});
		test("returns 400 when wrong data type sent", () => {
			return request(app)
				.patch("/api/articles/1")
				.send({ inc_votes: "hi" })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad request");
				});
		});
		test("returns 401 when incorrect data key sent", () => {
			return request(app)
				.patch("/api/articles/1")
				.send({ wrong: 2 })
				.expect(401)
				.then(({ body }) => {
					expect(body.msg).toBe("no votes to patch");
				});
		});
	});
});

describe("/api/articles", () => {
	describe("GET", () => {
		test("returns 200 and an array of all articles, descending by created_by", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					expect(body.articles.length).not.toBe(0);
					expect(body.articles).toBeSortedBy("created_at", {
						descending: true,
					});
					body.articles.forEach((article) => {
						expect(typeof article.author).toBe("string");
						expect(typeof article.title).toBe("string");
						expect(typeof article.article_id).toBe("number");
						expect(typeof article.topic).toBe("string");
						expect(typeof article.created_at).toBe("string");
						expect(typeof article.votes).toBe("number");
						expect(typeof article.article_img_url).toBe("string");
						expect(typeof article.comment_count).toBe("string");
					});
				});
		});
	});
	describe("SORTING QUERIES", () => {
		test("200 - default sorts descending by created_by", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					expect(body.articles).toBeSortedBy("created_at", {
						descending: true,
					});
				});
		});
		test("200 - sorted_by=author returns articles sorted by author, desc default", () => {
			return request(app)
				.get("/api/articles?sort_by=author")
				.expect(200)
				.then(({ body }) => {
					expect(body.articles).toBeSortedBy("author", {
						descending: true,
					});
				});
		});
		test("200 - order=ASC returns articles sorted ascending, created_at default", () => {
			return request(app)
				.get("/api/articles?order=asc")
				.expect(200)
				.then(({ body }) => {
					expect(body.articles).toBeSortedBy("created_at", {
						ascending: true,
					});
				});
		});
		test("200 - you can stack sorting and ordering queries", () => {
			return request(app)
				.get("/api/articles?sort_by=topic&order=asc")
				.expect(200)
				.then(({ body }) => {
					expect(body.articles).toBeSortedBy("topic", {
						ascending: true,
					});
				});
		});
    test("Responds with 400 and bad request for invalid order value", () => {
      return request(app)
        .get("/api/articles?order=helloworld")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request");
        });
    });
    test("Responds with 400 and bad request for invalid sort_by value", () => {
      return request(app)
        .get("/api/articles?sort_by=helloworld")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request");
        });
    });
    test("Responds with 400 and bad request when invalid sort_by value and valid order", () => {
      return request(app)
        .get("/api/articles?sort_by=helloworld&order=asc")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request");
        });
    });
    test("Responds with 400 and bad request when invalid order value and valid sort_by", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=hello")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request");
        });
    });
	});
  describe("FILTER QUERIES", () => {
    test("returns 200 and articles filtered by topic", () => {
      return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({body}) => {
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch")
        })
      })
    })
    test("404 topic not found if topic does not exist", () => {
      return request(app)
      .get("/api/articles?topic=rio")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("topic not found")
      })
    })
    test("200 empty array if topic exists but no articles", () => {
      return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({body}) => {
        expect(body.articles.length).toBe(0)
      })
    })
  })
});

describe("/api/articles/:article_id/comments", () => {
	describe("GET", () => {
		test("returns 200 and all relevent comments", () => {
			return request(app)
				.get("/api/articles/1/comments")
				.expect(200)
				.then(({ body }) => {
					expect(body.comments.length).toBe(11);
					expect(body.comments).toBeSortedBy("created_at", {
						descending: true,
					});
					body.comments.forEach((comment) => {
						expect(typeof comment.comment_id).toBe("number");
						expect(typeof comment.votes).toBe("number");
						expect(typeof comment.created_at).toBe("string");
						expect(typeof comment.author).toBe("string");
						expect(typeof comment.body).toBe("string");
						expect(comment.article_id).toBe(1);
					});
				});
		});
		test("GET returns 400 and bad request when invalid id type requested", () => {
			return request(app)
				.get("/api/articles/hello/comments")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad request");
				});
		});
		test("GET returns 404 and author id does not exist when non-existant author id requested", () => {
			return request(app)
				.get("/api/articles/600000000/comments")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Author id does not exist");
				});
		});
	});
	describe("POST", () => {
		test("responds 201 and posts new comment", () => {
			const comment = {
				username: "rogersop",
				body: "loved this",
			};
			return request(app)
				.post("/api/articles/1/comments")
				.send(comment)
				.expect(201)
				.then(({ body }) => {
					expect(body.comment.comment_id).toBe(19);
					expect(body.comment.body).toBe("loved this");
					expect(body.comment.article_id).toBe(1);
					expect(body.comment.author).toBe("rogersop");
					expect(body.comment.votes).toBe(0);
					expect(typeof body.comment.created_at).toBe("string");
				});
		});
		test("responds 401 missing username or body", () => {
			const comment = {
				wrong: "nope",
			};
			return request(app)
				.post("/api/articles/1/comments")
				.send(comment)
				.expect(401)
				.then(({ body }) => {
					expect(body.msg).toBe("missing either username or body");
				});
		});
		test("responds 400 bad request when article_id invalid", () => {
			const comment = {
				username: "rogersop",
				body: "loved this",
			};
			return request(app)
				.post("/api/articles/hello/comments")
				.send(comment)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad request");
				});
		});
		test("responds 404 article not found when article_id nonexistant", () => {
			const comment = {
				username: "rogersop",
				body: "loved this",
			};
			return request(app)
				.post("/api/articles/50000/comments")
				.send(comment)
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Article not found");
				});
		});
		test("responds 401 username invalid", () => {
			const comment = {
				username: "rio",
				body: "loved this",
			};
			return request(app)
				.post("/api/articles/1/comments")
				.send(comment)
				.expect(401)
				.then(({ body }) => {
					expect(body.msg).toBe("invalid user");
				});
		});
	});
});

describe("/api/comments/:comment_id", () => {
	describe("DELETE", () => {
		test("204 and deletes comment", () => {
			return request(app).delete("/api/comments/1").expect(204);
		});
		test("404 comment not found for valid but nonexistant id", () => {
			return request(app)
				.delete("/api/comments/10000")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("comment does not exist");
				});
		});
		test("400 bad request for invalid id", () => {
			return request(app)
				.delete("/api/comments/hello")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad request");
				});
		});
	});
});

describe("/api/users", () => {
	describe("GET", () => {
		test("200 and all users", () => {
			return request(app)
				.get("/api/users")
				.expect(200)
				.then(({ body }) => {
					body.users.forEach((user) => {
						expect(typeof user.username).toBe("string");
						expect(typeof user.name).toBe("string");
						expect(typeof user.avatar_url).toBe("string");
					});
				});
		});
	});
});
