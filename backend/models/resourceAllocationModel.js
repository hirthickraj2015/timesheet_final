const mongoose = require("mongoose");

const resourceAllocationSchema = new mongoose.Schema({
 projectId: String,
 userId: String,
 startDate: String,
 endDate: String,
});

module.exports = mongoose.model("resource_allocation", resourceAllocationSchema);
