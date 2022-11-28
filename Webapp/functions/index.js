const functions = require("firebase-functions");
const express = require("express");
const router = require("./routes/routes");

var cors = require("cors");
var app = express();

app.use(cors());
app.use(router);

exports.app = functions.https.onRequest(app);
