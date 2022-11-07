const { db } = require("../config/firebase");

const addEntry = async (req, res) => {
  const { lat, lon, time } = req.body;
  try {
    const entry = db.collection("entries").doc();
    const entryObject = {
      id: entry.id,
      lat,
      lon,
      time,
    };
    entry.set(entryObject);
    res.status(200).send({
      status: "successful",
      message: "entry added successfully",
      data: entryObject,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const updateEntry = async (req, res) => {
  const {
    body: { lat, lon, time },
    params: { entryId },
  } = req;
  try {
    const entry = db.collection("entries").doc(entryId);
    const currentData = (await entry.get()).data() || {};
    const entryObject = {
      lat: lat || currentData.lat,
      lon: lon || currentData.lon,
      time: time || currentData.time,
    };
    await entry.set(entryObject).catch((err) => {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    });
    return res.status(200).json({
      status: "successful",
      message: "entry updated successfully",
      data: entryObject,
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const deleteEntry = async (req, res) => {
  const { entryId } = req.params;
  try {
    const entry = db.collection("entries").doc(entryId);
    await entry.delete().catch((err) => {
      return res.status(400).json({
        status: "error",
        message: err.message,
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

const getAllEntries = async (req, res) => {
  try {
    const allEntries = [];
    const query = await db.collection("entries").get();
    query.forEach((doc) => {
      allEntries.push(doc.data());
    });
    return res.status(200).json(allEntries);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

module.exports = {
  addEntry,
  updateEntry,
  deleteEntry,
  getAllEntries,
};
