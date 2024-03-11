const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Score = require("../models/Score");
const Level = require("../models/Level");

// GET ALL LEVELS

exports.getLevels = asyncHandler(async (req, res, next) => {
  const allLevels = await Level.find().sort({ name: 1 }).exec();

  if (!allLevels || allLevels.length === 0) {
    res.status(404).json({ message: "Error: No levels found." });
    return;
  }

  res.status(200).json(allLevels);
});

// GET ALL SCORES

exports.getScores = asyncHandler(async (req, res, next) => {
  const allScores = await Score.find().sort({ score: -1 }).exec();

  if (!allScores) {
    res.status(404).json({ message: "Error: No scores found." });
    return;
  }

  res.status(200).json(allScores);
});

// POST CREATE LEVEL

exports.createLevel = [
  body("name", "Level name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("characters", "Characters must not be empty.").notEmpty(),
  body("dimensions", "Dimensions must not be empty.").notEmpty(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(401).json({ errors: errors.array() });
      return;
    }

    const level = new Level({
      name: req.body.name,
      characters: req.body.characters,
      dimensions: req.body.dimensions,
    });

    const newLevel = await level.save();
    res.status(200).json(newLevel);
  }),
];

// GET LEVEL

exports.getLevel = asyncHandler(async (req, res, next) => {
  const level = await Level.findById(req.params.levelID).exec();
  if (!level) {
    res.status(404).json({ message: "Error: No level found." });
    return;
  }

  res.status(200).json(level);
});

// PUT UPDATE LEVEL

exports.updateLevel = [
  body("name", "Level name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("characters", "Characters must not be empty.").notEmpty(),
  body("dimensions", "Dimensions must not be empty.").notEmpty(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(401).json({ errors: errors.array() });
      return;
    }

    const updatedLevelDetails = {
      name: req.body.name,
      characters: req.body.characters,
      dimensions: req.body.dimensions,
      _id: req.params.levelID,
    };

    const updatedLevel = await Level.findByIdAndUpdate(
      req.params.levelID,
      updatedLevelDetails,
      { new: true }
    );

    if (!updatedLevel) {
      res.status(404).json({ message: "Error: Level not found." });
      return;
    }

    res.status(200).json(updatedLevel);
  }),
];

// DELETE LEVEL

exports.deleteLevel = asyncHandler(async (req, res, next) => {
  const levelToDelete = await Level.findById(req.params.levelID);
  if (!levelToDelete) {
    res.status(404).json({ message: "Error: Level not found." });
    return;
  }
  if (levelToDelete.scores.length === 0) {
    await Level.findByIdAndDelete(req.params.levelID);
    res.status(200).json({ message: "Level successfully deleted." });
    return;
  } else {
    levelToDelete.scores.forEach(async (score) => {
      const scoreToDelete = await Score.findById(score);
      await Score.findByIdAndDelete(scoreToDelete._id);
    });
    await Level.findByIdAndDelete(req.params.levelID);
    res.status(200).json({ message: "Level successfully deleted." });
    return;
  }
});

// GET ALL LEVEL SCORES

exports.getLevelScores = asyncHandler(async (req, res, next) => {
  const allLevelScores = await Score.find({ level: req.params.levelID })
    .sort({ score: -1 })
    .exec();

  if (!allLevelScores) {
    res.status(404).json({ message: "Error: Scores not found." });
    return;
  }

  res.status(200).json(allLevelScores);
});

// POST CREATE SCORE

exports.createScore = [
  body("username", "Level name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("score", "Score must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(401).json({ errors: errors.array() });
      return;
    }

    const newScore = new Score({
      username: req.body.username,
      score: req.body.score,
      level: req.params.levelID,
    });

    await newScore.save();
    await Level.findByIdAndUpdate(req.params.levelID, {
      $push: { scores: newScore },
    });
    res.status(200).json(newScore);
  }),
];

// GET A LEVEL SCORE

exports.getLevelScore = asyncHandler(async (req, res, next) => {
  const levelScore = await Score.findById(req.params.scoreID).exec();

  if (!levelScore) {
    res.status(404).json({ message: "Error: Score not found." });
    return;
  }

  res.status(200).json(levelScore);
});

// DELETE LEVEL SCORE

exports.deleteLevelScore = asyncHandler(async (req, res, next) => {
  const scoreToDelete = await Score.findById(req.params.scoreID);
  if (!scoreToDelete) {
    res.status(404).json({ message: "Error: Score not found." });
    return;
  }

  await Level.findByIdAndUpdate(req.params.levelID, {
    $pullAll: { scores: [scoreToDelete] },
  });
  await Score.findByIdAndDelete(req.params.scoreID);
  res.status(200).json({ message: "Score successfully deleted." });
});
