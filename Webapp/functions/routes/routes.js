const {
  getEntries,
  getFirstEntry,
  deleteAll,
} = require("../controller/helper_functions");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Hey there!");
});

router.get("/delete-all", deleteAll);
router.get("/get-entries", getEntries);
router.get("/get-first", getFirstEntry);

module.exports = router;
