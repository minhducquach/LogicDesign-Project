const {
  // addEntry,
  // updateEntry,
  // deleteEntry,
  getEntries,
} = require("../controller/helper_functions");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Hey there!");
});

// router.post("/add-entry", addEntry);
// router.post("/update-entry/:entryId", updateEntry);
// router.post("/delete-entry/:entryId", deleteEntry);
router.get("/get-entries", getEntries);

module.exports = router;
