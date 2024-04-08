const Feedback = require("../models/feedbackModel");

exports.getFeedbackDetails = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.body;
    const feedback = await Feedback.findOne({
      userID: userId,
      startDate,
      endDate,
    });
    if (!feedback) {
      // No feedback found, send a response indicating no feedback
      return res.status(200).json({ message: null });
    }
    // Feedback found, send a success message
    return res
      .status(200)
      .json({ message: "Feedback already submitted for this week." });
  } catch (error) {
    console.error("Error fetching feedback details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.feedbackSubmission = async (req, res) => {
  try {
    // Extract data from the request body
    const { userID, startDate, endDate, ...feedbackData } = req.body;

    // Create a new Feedback document
    const feedback = new Feedback({
      userID: userID,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      ...feedbackData,
    });

    // Save the feedback document to the database
    const savedFeedback = await feedback.save();
    res.status(200).send("Feedback saved successfully");
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getFeedbackByUserId = async (req, res) => {
  try {
    const { userID } = req.body;
    const allFeedback = await Feedback.find({userID: userID});
    if (!allFeedback || allFeedback.length === 0) {
      // No feedback found, send a response indicating no feedback
      return res.status(200).json({ message: "No feedback found." });
    }
    // Feedback found, send the feedback data
    return res.status(200).json({ feedback: allFeedback });
  } catch (error) {
    console.error("Error fetching feedback details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};