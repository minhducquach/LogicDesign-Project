const functions = require("firebase-functions");
const express = require("express");
const router = require("./routes/routes");
const bodyParser = require("body-parser");

var cors = require("cors");
var app = express();

// app.use(bodyParser)

app.use(bodyParser.json());
app.use(cors());
app.use(router);

exports.app = functions.https.onRequest(app);
