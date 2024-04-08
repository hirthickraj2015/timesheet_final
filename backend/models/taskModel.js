const mongoose = require("mongoose");

const projectTaskSchema = new mongoose.Schema({
    projectId: String,
    task: String,
});

module.exports = mongoose.model("project_tasks", projectTaskSchema);
