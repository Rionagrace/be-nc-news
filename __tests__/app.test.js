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
});
