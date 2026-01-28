const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth.middleware");

const {
  addComment,
  getComments,
} = require("../controllers/comment.controller");

// Add Comment
router.post("/:bugId", protect, addComment);

// Get All Comments
router.get("/:bugId", protect, getComments);

module.exports = router;
