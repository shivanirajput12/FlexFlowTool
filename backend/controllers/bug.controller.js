const Bug = require("../models/bug.model");
const Project = require("../models/project.model");

/**
 * Create Bug
 * POST /api/bugs
 */
exports.createBug = async (req, res) => {
  try {
    const { title, description, project, priority } = req.body;

    if (!title || !description || !project) {
      return res.status(400).json({
        message: "Title, description and project are required",
      });
    }

    // Check project access
    const projectData = await Project.findById(project);

    if (!projectData) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (!projectData.members.includes(req.user._id)) {
      return res.status(403).json({
        message: "You are not part of this project",
      });
    }

    const bug = await Bug.create({
      title,
      description,
      project,
      priority,
      reportedBy: req.user._id,
    });

    res.status(201).json(bug);
  } catch (error) {
    console.log("Create Bug Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Get All Bugs (User Projects)
 * GET /api/bugs
 */
exports.getMyBugs = async (req, res) => {
  try {
    const bugs = await Bug.find({
      $or: [
        { reportedBy: req.user._id },
        { assignedTo: req.user._id },
      ],
    })
      .populate("project", "name")
      .populate("reportedBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(bugs);
  } catch (error) {
    console.log("Get Bugs Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Get Bugs By Project
 * GET /api/bugs/project/:projectId
 */
exports.getProjectBugs = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (!project.members.includes(req.user._id)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const bugs = await Bug.find({ project: projectId })
      .populate("reportedBy", "name")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 });

    res.json(bugs);
  } catch (error) {
    console.log("Get Project Bugs Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Update Bug Status
 * PUT /api/bugs/:bugId/status
 */
exports.updateBugStatus = async (req, res) => {
  try {
    const { bugId } = req.params;
    const { status } = req.body;

    const bug = await Bug.findById(bugId);

    if (!bug) {
      return res.status(404).json({
        message: "Bug not found",
      });
    }

    bug.status = status;
    await bug.save();

    res.json({
      message: "Status updated",
      bug,
    });
  } catch (error) {
    console.log("Update Status Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Assign Bug
 * PUT /api/bugs/:bugId/assign
 */
exports.assignBug = async (req, res) => {
  try {
    const { bugId } = req.params;
    const { userId } = req.body;

    const bug = await Bug.findById(bugId).populate("project");

    if (!bug) {
      return res.status(404).json({
        message: "Bug not found",
      });
    }

    // Only project admin
    if (
      bug.project.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only project admin can assign bugs",
      });
    }

    bug.assignedTo = userId;
    await bug.save();

    res.json({
      message: "Bug assigned",
      bug,
    });
  } catch (error) {
    console.log("Assign Bug Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
