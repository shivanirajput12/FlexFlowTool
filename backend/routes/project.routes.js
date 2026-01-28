const express = require("express");
const router = express.Router();

const {
  createProject,
  getMyProjects,
  addMember,
} = require("../controllers/project.controller");

const { protect, authorize } = require("../middlewares/auth.middleware");

// Create project (Admin only)
router.post("/", protect, authorize("Admin"), createProject);

// Get my projects
router.get("/", protect, getMyProjects);

// Add member
router.post("/add-member", protect, authorize("Admin"), addMember);

module.exports = router;
