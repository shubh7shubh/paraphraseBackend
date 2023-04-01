const express = require("express");
const userAuth = require("../middleware/userAuth");
const {
  getAllUsersCtrl,
  addEmotionCtrl,
  getAllEmotionsCtrl,
  deleteEmotionCtrl,
  updateEmotionController,
} = require("../controllers/adminCtrl");
const {
  userDetails,
  commentCtrl,
  paraphrasingCtrl,
  logoutCtrl,
  getUserCtrl,
  copiedCtrl,
  countUsed
} = require("../controllers/userCtrl");
const router = express.Router();

// ......ADMIN API......
//get All Users Details
router.get("/admin/getAllUsers", getAllUsersCtrl);
//get All Emotions
router.get("/admin/getAllEmotions", getAllEmotionsCtrl);
//add emotion
router.post("/admin/addEmotion", addEmotionCtrl);
//delete emotion
router.delete("/admin/deleteEmotion/:name", deleteEmotionCtrl);
// update emotion
router.put("/admin/updateEmotion", updateEmotionController);
// ......ADMIN API......

//........USERS API..........

//add user details
router.post("/user-details", userDetails);
//get user Detail by id
router.get("/getUser/:id", getUserCtrl);
//copied or not
router.post("/copied", copiedCtrl);
//comment generation
router.post("/comment",userAuth, commentCtrl);
//paraphrasing
router.post("/paraphrasing",userAuth, paraphrasingCtrl);
//get count used
router.get("/countUsed",userAuth, countUsed);
// logout
router.get("/logout", logoutCtrl);

//........USERS API..........

module.exports = router;
