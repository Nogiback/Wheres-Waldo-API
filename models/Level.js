const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LevelSchema = new Schema({
  name: { type: String, required: true },
  characters: [
    {
      character: { type: String, required: true },
      locationX: { type: Number, required: true },
      locationY: { type: Number, required: true },
    },
  ],
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  imageURL: { type: String, required: true },
  scores: [{ type: Schema.Types.ObjectId, ref: "Score" }],
});

module.exports = mongoose.model("Level", LevelSchema);
