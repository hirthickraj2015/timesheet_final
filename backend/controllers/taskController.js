const ProjectTask = require("../models/taskModel");

exports.findTaskByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const tasks = await ProjectTask.find({ projectId });
    if (!tasks) {
      return res.status(404).json({ error: "Tasks not found" });
    }
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addTask = async (req, res) => {
  try {
    const { projectId, task } = req.body;

    // Create a new project task entry
    const newTask = new ProjectTask({ projectId, task });
    await newTask.save();

    res.status(200).json({ message: "Project task added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
