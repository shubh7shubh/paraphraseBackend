const express = require("express");
const userAuth = require("../middleware/userAuth");
const {
  getAllUsersCtrl,
  addEmotionCtrl,
  getAllEmotionsCtrl,
  deleteEmotionCtrl,
  updateEmotionController,
} = require("../controllers/adminCtrl");
const { checkout, paymentVerification } = require("../controllers/paymentCtrl");
const {
  userDetails,
  commentCtrl,
  paraphrasingCtrl,
  regenerateCommentCtrl,
  regenerateParaCtrl,
  logoutCtrl,
  getUserCtrl,
  copiedCtrl,
  countUsed,
  getCurrentUserCtrl,
} = require("../controllers/userCtrl");
const { chatHandle, getAllChats } = require("../controllers/chatCtrl");
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
//get Current Logged in user
router.get("/getCurrentUser", userAuth, getCurrentUserCtrl);
//copied or not
router.post("/copied", copiedCtrl);
//comment generation
router.post("/comment", userAuth, commentCtrl);
//paraphrasing
router.post("/paraphrasing", userAuth, paraphrasingCtrl);
//regenerate comment
router.post("/regenerateComment", userAuth, regenerateCommentCtrl);
//regenerate paraphrasing
router.post("/regeneratePara", userAuth, regenerateParaCtrl);
//get count used
router.get("/countUsed", userAuth, countUsed);
// logout
router.get("/logout", logoutCtrl);

//........USERS API..........
//........payment API.......
router.post("/checkout", userAuth, checkout);
router.post("/paymentverification", paymentVerification);
// .......payment API.......

//CHAT API.......
router.post("/chat", userAuth, chatHandle);
router.get(
  "/getAllChats",
   userAuth,
  getAllChats
);
// CHAT API......

module.exports = router;
