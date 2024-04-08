const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
 userID: String,
 startDate: Date,
 endDate: Date,
 q1: Number,
 q2: Number,
 q3: Number,
 q4: Number,
 q5: Number,
 q6: Number,
 q7: Number,
 q8: Number,
 q9: Number,
 q10: Number,
 q11: Number,
 q12: Number,
 q13: String,
 q14: String,
 q15: String,
});

module.exports = mongoose.model("feedback_details", feedbackSchema);
