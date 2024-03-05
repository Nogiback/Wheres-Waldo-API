const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Score = require("../models/Score");
const Level = require("../models/Level");

exports.getLevels = asyncHandler(async (req, res, next) => {
  const allLevels = await Level.find().score({ name: 1 }).exec();

  if (!allLevels) {
    res.status(404).json({ message: "Error: No levels found." });
    return;
  }

  res.status(200).json(allLevels);
});

exports.getScores = asyncHandler(async (req, res, next) => {
  const allScores = await Score.find().sort({ score: -1 }).exec();

  if (!allScores) {
    res.status(404).json({ message: "Error: No scores found." });
    return;
  }

  res.status(200).json(allScores);
});

exports.createLevel = asyncHandler(async (req, res, next) => {
  const level = new Level({
    name: req.body.name,
    characters: req.body.characters,
    dimensions: req.body.dimensions,
  });
  const newLevel = await level.save();
  res.status(200).json({ newLevel });
});

exports.getLevel = asyncHandler(async (req, res, next) => {
  res.status(200).json({ message: "getLevel NOT YET IMPLEMENTED" });
});

exports.updateLevel = asyncHandler(async (req, res, next) => {
  res.status(200).json({ message: "updateLevel NOT YET IMPLEMENTED" });
});

exports.getLevelScores = asyncHandler(async (req, res, next) => {
  res.status(200).json({ message: "getLevelScores NOT YET IMPLEMENTED" });
});

exports.createScore = asyncHandler(async (req, res, next) => {
  res.status(200).json({ message: "createScore NOT YET IMPLEMENTED" });
});

exports.getLevelScore = asyncHandler(async (req, res, next) => {
  res.status(200).json({ message: "getLevelScore NOT YET IMPLEMENTED" });
});
