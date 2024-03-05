const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  level: { type: Schema.Types.ObjectId, ref: "Level" },
});

module.exports = mongoose.model("Score", ScoreSchema);
