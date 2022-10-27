const express = require("express");
const path = require("path");
const routes = require("../router/routes");

const app = express();

app.use(require("body-parser").urlencoded({ extended: false }));
app.use(express.json());

app.use(routes);

module.exports = app;
