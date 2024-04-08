const ProjectDetails = require("../models/projectModel");
const ProjectTask=require("../models/taskModel")
exports.addProject = async (req, res) => {
  try {
    const { projectName, projectId, category, startDate, endDate, tasks } =
      req.body;

    // Check if the projectId already exists
    const existingProject = await ProjectDetails.findOne({ projectId });
    if (existingProject) {
      return res.status(400).json({ error: "Project ID already exists" });
    }

    // Create a new project in ProjectDetails collection
    const newProject = new ProjectDetails({
      projectName,
      projectId,
      category,
      startDate,
      endDate,
    });
    await newProject.save();

    // Save tasks associated with the project
    await Promise.all(
      tasks.map(async (task) => {
        const newTask = new ProjectTask({ projectId, task });
        await newTask.save();
      })
    );

    res.status(200).json({ message: "Project added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectDetails.find();
    res.status(200).json(projects);
    console.log("projects",projects)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProjectById = async (req,res) =>{
  try {
    const projectId = req.params.projectId;
    const project = await ProjectDetails.findOne({ projectId });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add other project-related controller functions
