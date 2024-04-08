const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const projectController = require("../controllers/projectController");
const resourceAllocationController = require("../controllers/resourceAllocationController");
const timesheetController = require("../controllers/timesheetController");
const feedbackController = require("../controllers/feedbackController");
const taskController=require("../controllers/taskController");
//User routes
router.post("/add-user", userController.addUser);
router.post("/login", userController.login);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword", userController.resetPassword);
router.get("/users",userController.getAllUserDetails);
router.get("/user-details/:userID",userController.getUserDetails);

// Project routes
router.post("/add-project", projectController.addProject);
router.get("/projects",projectController.getAllProjects);
router.get("/projects/:projectId",projectController.getProjectById);

//Task routes
router.get("/tasks/:projectId",taskController.findTaskByProject);
router.post("/add-project-task",taskController.addTask);

//Resource Allocation routes
router.post("/allocate-resources", resourceAllocationController.allocateResources);
router.get("/resource-allocation/:userId", resourceAllocationController.getResourceAllocationByUserId);

//Timesheet routes
router.post('/submit-timesheet', timesheetController.submitTimesheet);
router.post('/timesheets-data', timesheetController.getTimesheetData);

// Feedback routes
router.post('/feedback-details', feedbackController.getFeedbackDetails);
router.post("/feedback-submission",feedbackController.feedbackSubmission);
router.post("/feedback-history",feedbackController.getFeedbackByUserId)
module.exports = router;
