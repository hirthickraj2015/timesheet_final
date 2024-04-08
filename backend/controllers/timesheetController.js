const TimesheetEn = require("../models/timesheetModel");

exports.submitTimesheet = async (req, res) => {
  try {
    const { userId, startDate, endDate, rows, status } = req.body;

    // Check if timesheet entry already exists for the provided userId, startDate, and endDate
    const existingTimesheetEntry = await TimesheetEn.findOne({
      userId,
      startDate,
      endDate,
    });

    if (existingTimesheetEntry) {
      // If an entry already exists, check its status
      if (existingTimesheetEntry.status === 'save') {
        // If status is 'save', update the existing entry
        existingTimesheetEntry.rows = rows;
        existingTimesheetEntry.status = status;
        await existingTimesheetEntry.save();
        // Send success message with status 200
        res.status(200).json({ message: 'Timesheet entry updated successfully' });
      } else {
        // If status is 'submitted', indicate that it can't be edited
        // Send status 400 with error message
        res.status(400).json({
          error: 'Timesheet has already been submitted and cannot be edited',
          status: 'AlreadySubmitted', // Add status field to indicate already submitted
        });
      }
    } else {
      // If no entry exists, create a new timesheet entry
      const newTimesheetEntry = new TimesheetEn({
        userId,
        startDate,
        endDate,
        rows,
        status,
      });
      await newTimesheetEntry.save();
      // Send success message with status 200
      res.status(200).json({ message: 'New timesheet entry stored successfully' });
    }
  } catch (err) {
    console.error(err);
    // Send status 500 with error message
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTimesheetData = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.body;

    // Find timesheet entries that match the userId, startDate, and endDate
    const timesheets = await TimesheetEn.find({ userId, startDate, endDate });

    if (timesheets.length === 0) {
      // If no timesheet entries are found, return a 404 status code with an error message
      return res.status(404).json({
        error: "No timesheet entries found for the specified criteria",
      });
    }
    // If timesheet entries are found, return them in the response
    res.status(200).json(timesheets);
  } catch (error) {
    console.error("Error fetching timesheet data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
