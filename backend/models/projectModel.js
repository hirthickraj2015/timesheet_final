const mongoose = require("mongoose");

const projectDetailSchema = new mongoose.Schema({
 projectName: String,
 projectId: { type: String, unique: true },
 category: String,
 startDate: String,
 endDate: String,
});

module.exports = mongoose.model("project_details", projectDetailSchema);