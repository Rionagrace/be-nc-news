const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const index = require("../db/data/test-data/index.js")
const endPoints = require("../endpoints.json")

beforeEach(() => seed(index))
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
        expect(response.body.topics.length).toBe(3)
				response.body.topics.forEach((topic) => {
				expect(typeof topic.description).toBe("string")
        expect(typeof topic.slug).toBe("string")
				})
			});
	});
});

describe("/api", () => {
  test("returns 200 and documents all other endpoints available.", () => {
    return request(app)
    .get("/api")
    .expect(200)
    .then(({body}) => {
      expect(body.endPoints).toEqual(endPoints)
    })
  })
})
