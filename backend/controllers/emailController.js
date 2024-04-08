const UserDetails = require("../models/userModel");
const TimesheetEn = require("../models/timesheetModel");
const Feedback = require("../models/feedbackModel");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const moment = require("moment");

const transporter = nodemailer.createTransport({
  service: "Gmail", // Update with your email service provider (e.g., Gmail)
  auth: {
    user: "hirthickraj2015@gmail.com", // Update with your email address
    pass: "qqgo exwu daqk zljb", // Update with your email password
  },
  logger: true,
});

const sendEmailNotification = async (user, message) => {
  const mailOptions = {
    from: "hirthickraj2015@gmail.com",
    to: user.mailID,
    subject: " Feedback And Timesheet Completion Notification",
    text: `Dear ${user.firstName},\n\n${message}\n\nThank you,\nThe System`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Notification email sent:", info.response);
    }
  });
};

exports.sendCompletionNotifications = async () => {
  try {
    const currentDate = new Date();

    // Calculate start date (Sunday of the previous week)
    const sundayDate2 = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay())
    );
    // Set the timezone to UTC and set the hours to 18:30
    sundayDate2.setUTCHours(18, 30, 0, 0);
    const timesheetStartDate = sundayDate2;

    // Calculate end date (Monday of the current week)
    const mondayDate = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6)
    );
    // Set the timezone to UTC and set the hours to 18:30
    mondayDate.setUTCHours(18, 30, 0, 0);
    const timesheetEndDate = mondayDate;

    // Convert timesheet start and end date to ISO string format
    const timesheetStartISO = timesheetStartDate.toISOString();
    const timesheetEndISO = timesheetEndDate.toISOString();

    // For feedback, we'll keep the existing logic as it was not part of the request to change.
    const mondayDate2 = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)
    );
    const feedbackStartDate = mondayDate2.toISOString().split("T")[0];

    // Calculate end date (Sunday of the current week)
    const sundayDate = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7)
    );
    const feedbackEndDate = sundayDate.toISOString().split("T")[0];

    const allUsers = await UserDetails.find();

    for (const user of allUsers) {
      // Query timesheet entries
      const timesheetEntries = await TimesheetEn.find({
        userId: user.userID,
        startDate: { $gte: new Date(timesheetStartDate) },
        endDate: { $lte: new Date(timesheetEndDate) },
      });

      // Query feedback entries
      const feedbackEntries = await Feedback.find({
        userID: user.userID,
        startDate: { $gte: new Date(feedbackStartDate) },
        endDate: { $lte: new Date(feedbackEndDate) },
      });

      if (timesheetEntries.length > 0 && feedbackEntries.length > 0) {
        console.log(
          `Great job, ${user.firstName}! You have completed both timesheet and feedback for this week.`
        );
        sendEmailNotification(
          user,
          "Great job! You have completed both timesheet and feedback for this week."
        );
      } else if (timesheetEntries.length === 0 && feedbackEntries.length > 0) {
        console.log(
          `Hey ${user.firstName}, you have completed feedback but not timesheet for this week.`
        );
        sendEmailNotification(
          user,
          "Hey, you have completed feedback but not timesheet for this week."
        );
      } else if (timesheetEntries.length > 0 && feedbackEntries.length === 0) {
        console.log(
          `Hey ${user.firstName}, you have completed timesheet but not feedback for this week.`
        );
        sendEmailNotification(
          user,
          "Hey, you have completed timesheet but not feedback for this week."
        );
      } else {
        console.log(
          `Hey ${user.firstName}, complete both timesheet and feedback for this week!`
        );
        sendEmailNotification(
          user,
          "Hey, complete both timesheet and feedback for this week!"
        );
      }
    }

    console.log("Completion notifications sent successfully");
  } catch (error) {
    console.error("Error sending completion notifications:", error);
  }
};


