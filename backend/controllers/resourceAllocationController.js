const ResourceAllocation = require("../models/resourceAllocationModel");
const ProjectDetails = require("../models/projectModel");

exports.getResourceAllocationByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const resourceAllocations = await ResourceAllocation.find({ userId });
    res.json(resourceAllocations);
  } catch (error) {
    console.error("Error fetching resource allocation details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.allocateResources = async (req, res) => {
  // Add other resource allocation-related controller functions
try {
  const { projectId, userId, startDate, endDate, allocatedBy } = req.body;

  // Check if the project exists
  const existingProject = await ProjectDetails.findOne({ projectId });
  if (!existingProject) {
    return res.status(404).json({ error: "Project not found" });
  }

  // Create a new resource allocation entry
  const newAllocation = new ResourceAllocation({
    projectId,
    userId,
    startDate,
    endDate,
  });
  await newAllocation.save();

  res.status(200).json({ message: "Resource allocation successful" });
} catch (err) {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
 };
