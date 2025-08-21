const express = require("express");
const {
  addLike,
  getUserLikes,
  getAllLikes,
  getPropertyLikes,
  removeLike,
  getLikesStats
} = require("../controllers/likesController");

const router = express.Router();

// Add or update a like
router.route("/likes").post(addLike);

// Get all likes for a specific user
router.route("/likes/user/:userAddress").get(getUserLikes);

// Get all likes for a specific property
router.route("/likes/property/:propertyId").get(getPropertyLikes);

// Get all likes (for admin dashboard)
router.route("/likes/all").get(getAllLikes);

// Get likes statistics
router.route("/likes/stats").get(getLikesStats);

// Remove a like
router.route("/likes/:likeId").delete(removeLike);

module.exports = router;
