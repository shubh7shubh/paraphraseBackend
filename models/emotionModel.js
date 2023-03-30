const mongoose = require("mongoose");

const emotionSchema = mongoose.Schema({
  name: {
    type: String,
  },
});

const emotionModel = mongoose.model("emotions", emotionSchema);
module.exports = emotionModel;
