const express = require("express");
const cors = require("cors");
require("dotenv").config();
const allRoutes = require("./routes/allRoutes");
const app = express();
const dbConnect = require("./db/db");
const EmailController = require("./controllers/emailController"); // Import EmailController
const schedule = require("node-schedule"); // Import node-schedule
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(allRoutes);

dbConnect();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
 scheduleNotifications(); // Call the scheduleNotifications function here
});

// Function to schedule notifications
function scheduleNotifications() {
 const rule = new schedule.RecurrenceRule();
 rule.dayOfWeek = 1; // Sunday
 rule.hour = 10; // 3:00 AM
 rule.minute = 13; // 19 minutes past the hour

 const job = schedule.scheduleJob(rule, async () => {
    try {
      // Call sendCompletionNotifications function
      await EmailController.sendCompletionNotifications();
      console.log("Scheduled job triggered and emails sent successfully");
    } catch (error) {
      console.error("Error sending completion notifications:", error);
    }
 });
}
