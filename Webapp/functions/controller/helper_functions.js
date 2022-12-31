const { db } = require("../config/firebase");

const deleteAll = async (req, res) => {
  try {
    db.collection("data")
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((snapshot) => {
          snapshot.ref.delete();
        });
      });
    return res.status(200).json({
      status: "successful",
      message: "entry deleted successfully",
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const getEntries = async (req, res) => {
  try {
    const entry = [];
    const querySnapshot = await db
      .collection("data")
      .orderBy("id", "desc")
      .limit(7)
      .get();
    querySnapshot.forEach((doc) => {
      entry.push(doc.data());
    });
    return res.status(200).json(entry);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
const getFirstEntry = async (req, res) => {
  try {
    const entry = [];
    const querySnapshot = await db
      .collection("data")
      .orderBy("id", "desc")
      .limit(1)
      .get();
    querySnapshot.forEach((doc) => {
      entry.push(doc.data());
    });
    return res.status(200).json(entry);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

module.exports = {
  deleteAll,
  getEntries,
  getFirstEntry,
};
