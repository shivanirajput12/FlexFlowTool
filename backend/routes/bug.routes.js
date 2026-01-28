const express = require("express");
const router = express.Router();

const {
  createBug,
  getMyBugs,
  getProjectBugs,
  updateBugStatus,
  assignBug,
} = require("../controllers/bug.controller");

const { protect } = require("../middlewares/auth.middleware");

// Create bug
router.post("/", protect, createBug);

// Get my bugs
router.get("/", protect, getMyBugs);

// Get project bugs
router.get("/project/:projectId", protect, getProjectBugs);

// Update status
router.put("/:bugId/status", protect, updateBugStatus);

// Assign bug
router.put("/:bugId/assign", protect, assignBug);

module.exports = router;
