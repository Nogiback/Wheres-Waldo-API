const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ message: "Hello! This is Nogiback's Where's Waldo API" });
});

// GAME ROUTES
router.get("/levels", gameController.getLevels);
router.get("/scores", gameController.getScores);
router.post("/levels", gameController.createLevel);
router.get("/levels/:levelID", gameController.getLevel);
router.put("/levels/:levelID", gameController.updateLevel);
router.delete("/levels/:levelID", gameController.deleteLevel);
router.get("/levels/:levelID/completed", gameController.completeLevel);
router.get("/levels/:levelID/scores", gameController.getLevelScores);
router.post("/levels/:levelID/scores", gameController.createScore);
router.get("/levels/:levelID/scores/:scoreID", gameController.getLevelScore);
router.delete(
  "/levels/:levelID/scores/:scoreID",
  gameController.deleteLevelScore
);

module.exports = router;
