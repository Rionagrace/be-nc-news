const express = require("express");

const { getTopics } = require("./api/controllers/topics.controllers.js");

const express = require("express");

app.get("/api/topics", getTopics);

module.exports = app;
