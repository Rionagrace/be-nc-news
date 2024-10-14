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
	test("returns 200 and the specified article", () => {
		return request(app)
			.get("/api/articles/1")
			.expect(200)
			.then(({ body }) => {
				expect(body.article.title).toBe("Living in the shadow of a great man");
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
  test("returns 400 when request has incorrect format(nan)", () => {
    return request(app)
    .get("/api/articles/hello")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad request")
    })
  })
  test("returns 404 when valid but non-existant id requested", () => {
    return request(app)
    .get("/api/articles/34567")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Article not found")
    })
  })
});

describe("/api/articles", () => {
  test("returns 200 and an array of all articles, descending by created_by", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body}) => {
      console.log(body.articles)
      expect(body.articles).toBeSortedBy("created_at",{descending: true})
      body.articles.forEach((article) => {
        expect(typeof article.author).toBe("string")
        expect(typeof article.title).toBe("string")
        expect(typeof article.article_id).toBe("number")
        expect(typeof article.topic).toBe("string")
        expect(typeof article.created_at).toBe("string")
        expect(typeof article.votes).toBe("number")
        expect(typeof article.article_img_url).toBe("string")
      })
    })
  })
})