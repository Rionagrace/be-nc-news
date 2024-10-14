const express = require("express");
const { getTopics, getEndPoints } = require("./api/controllers/topics.controllers.js");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndPoints)

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send({ msg: "Something went wrong" });
});

module.exports = app;
