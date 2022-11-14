const functions = require("firebase-functions");
const express = require("express");
const router = require("./routes/routes");

var cors = require('cors');
const PORT = process.env.PORT || 5001;
var app = express();

app.use(cors());
app.use(router);
app.get("/get-entries", (req, res) => console.log(res));
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

exports.app = functions.https.onRequest(app);
