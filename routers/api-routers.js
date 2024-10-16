const { getEndPoints } = require("../api/controllers/topics.controllers");
const { articlesRouter } = require("./articles-routers");
const { commentsRouter } = require("./comments-routers");
const { topicsRouter } = require("./topics-routers");

const apiRouter = require("express").Router();
const { usersRouter } = require("./users-routers");

apiRouter.get("/", getEndPoints);

apiRouter.use("/users", usersRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/topics", topicsRouter);

module.exports = { apiRouter };
