const { db } = require("../config/firebase");

const count = 10;
let index = 0;

// const addEntry = async (req, res) => {
//   const { lat, lon, time } = req.body;
//   const ref = db.collection("entries");
//   if (index == 0) index = (await ref.get()).size;
//   console.log(index);
//   if ((await ref.get()).size >= count) {
//     const firstID = index - count + 1;
//     console.log(firstID);
//     const entry = ref.doc(`entry ${firstID}`);
//     console.log("ok");
//     await entry.delete().catch((err) => {
//       return res.status(400).json({
//         status: "error",
//         message: err.message,
//       });
//     });
//   }
//   try {
//     index++;
//     const entryObject = {
//       id: index,
//       lat,
//       lon,
//       time,
//     };
//     ref.doc(`entry ${index}`).set(entryObject);
//     res.status(200).send({
//       status: "successful",
//       message: "entry added successfully",
//       data: entryObject,
//     });
//   } catch (err) {
//     res.status(500).json(err.message);
//   }
// };

// const updateEntry = async (req, res) => {
//   const {
//     body: { lat, lon, time },
//     params: { entryId },
//   } = req;
//   try {
//     const entry = db.collection("entries").doc(`entry ${entryId}`);
//     const currentData = (await entry.get()).data() || {};
//     const entryObject = {
//       lat: lat || currentData.lat,
//       lon: lon || currentData.lon,
//       time: time || currentData.time,
//     };
//     await entry.set(entryObject).catch((err) => {
//       return res.status(400).json({
//         status: "error",
//         message: err.message,
//       });
//     });
//     return res.status(200).json({
//       status: "successful",
//       message: "entry updated successfully",
//       data: entryObject,
//     });
//   } catch (err) {
//     return res.status(500).json(err.message);
//   }
// };

// const deleteEntry = async (req, res) => {
//   const { entryId } = req.params;
//   try {
//     const entry = db.collection("entries").doc(`entry ${entryId}`);
//     await entry.delete().catch((err) => {
//       return res.status(400).json({
//         status: "error",
//         message: err.message,
//       });
//     });
//     return res.status(200).json({
//       status: "successful",
//       message: "entry deleted successfully",
//     });
//   } catch (err) {
//     return res.status(500).json(err.message);
//   }
// };

const getEntries = async (req, res) => {
  try {
    const allEntries = [];
    const querySnapshot = await db
      .collection("entries")
      .orderBy("id", "desc")
      .limit(10)
      .get();
    querySnapshot.forEach((doc) => {
      allEntries.push(doc.data());
    });
    return res.status(200).json(allEntries);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

module.exports = {
  // addEntry,
  // updateEntry,
  // deleteEntry,
  getEntries,
};