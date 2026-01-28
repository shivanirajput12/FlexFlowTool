const Comment = require("../models/comment.model");
const Bug = require("../models/bug.model");

// ================= ADD COMMENT =================
exports.addComment = async (req, res) => {
  try {
    const { bugId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    // Check bug exists
    const bug = await Bug.findById(bugId);

    if (!bug) {
      return res.status(404).json({
        message: "Bug not found",
      });
    }

    // Create comment
    const comment = await Comment.create({
      bug: bugId,
      user: req.user._id,
      message,
    });

    // Populate user
    const populated = await comment.populate(
      "user",
      "name email role"
    );

    res.status(201).json(populated);
  } catch (err) {
    console.error("Add Comment Error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= GET COMMENTS =================
exports.getComments = async (req, res) => {
  try {
    const { bugId } = req.params;

    const comments = await Comment.find({
      bug: bugId,
    })
      .populate("user", "name email role")
      .sort({ createdAt: 1 });

    res.status(200).json(comments);
  } catch (err) {
    console.error("Get Comment Error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};
