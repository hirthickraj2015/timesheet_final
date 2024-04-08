const mongoose = require("mongoose");

const timesheetEntrySchema = new mongoose.Schema({
 userId: String,
 startDate: Date,
 endDate: Date,
 rows: [
    {
      category: String,
      projectId: String,
      taskId: String,
      comments: String,
      column_0: Number,
      column_1: Number,
      column_2: Number,
      column_3: Number,
      column_4: Number,
      column_5: Number,
      column_6: Number,
    },
 ],
 status: String,
}, { strict: false });

module.exports = mongoose.model("timesheet", timesheetEntrySchema);
