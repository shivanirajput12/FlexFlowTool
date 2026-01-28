const Project = require("../models/project.model");

// Create Project (Admin)
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(project);
  } catch (error) {
    console.log("Create Project Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All My Projects
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user._id,
    })
      .populate("members", "name email role")
      .populate("createdBy", "name email");

    res.json(projects);
  } catch (error) {
    console.log("Get Projects Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Member to Project (Admin)
exports.addMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only creator can add
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only admin can add members",
      });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({
        message: "User already added",
      });
    }

    project.members.push(userId);
    await project.save();

    res.json({
      message: "Member added",
      project,
    });
  } catch (error) {
    console.log("Add Member Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
