import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Feedback.css";

function Feedback() {
  const { userID } = useParams();
  const [userRole, setUserRole] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStars, setActiveStars] = useState({});
  const [userInputs, setUserInputs] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to control form visibility

  useEffect(() => {
    // Calculate start date (Monday) of the current week
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    const mondayDate = new Date(currentDate); // Clone the current date
    const daysToAdd = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    mondayDate.setDate(currentDate.getDate() + daysToAdd);
    const startDate = mondayDate.toISOString().split("T")[0];
    console.log("StartDate: ", startDate);
  
    // Calculate end date (Sunday) of the current week
    const sundayDate = new Date(mondayDate); // Clone the Monday date
    sundayDate.setDate(mondayDate.getDate() + 6); // Add 6 days to get Sunday
    const endDate = sundayDate.toISOString().split("T")[0];
    console.log("EndDate: ", endDate);
  
    // Send request to backend to fetch feedback data
    axios
      .post("http://localhost:4000/feedback-details", {
        userId: userID,
        startDate,
        endDate,
      })
      .then((response) => {
        if (response.data.message) {
          // Feedback record found
          setFeedbackMessage(response.data.message);
          setShowForm(false); // Hide the form
        } else {
          // No feedback record found
          setShowForm(true); // Display the form
        }
      })
      .catch((error) => {
        console.error("Error fetching feedback data:", error);
        setFeedbackMessage("Error fetching feedback data. Please try again.");
      });
  }, [userID]);  

  useEffect(() => {
    axios
      .get(`http://localhost:4000/user-details/${userID}`)
      .then((response) => {
        setUserRole(response.data.role);
        console.log("User role fetched:", response.data.role);
      })
      .catch((error) => {
        console.error("Error fetching user role:", error);
      });
  }, [userID]);

  useEffect(() => {
    // Define questions based on user role
    const commonQuestions = {
      q1: "How well did you understand the technical requirements of the project? (1 - Not at all, 5 - Completely)",
      q2: "Did you consistently meet deadlines and deliver work on time? (1 - Never, 5 - Always)",
      q3: "How effective was your communication with other team members? (1 - Poor, 5 - Excellent)",
      q4: "Did you actively participate in discussions and offer valuable insights? (1 - Rarely, 5 - Always)",
      q5: "How well did you manage your workload and prioritize tasks effectively? (1 - Poorly, 5 - Very Well)",
      q6: "Rate your proficiency in the programming languages used for the project. (1 - Novice, 5 - Expert)",
      q7: "Were you comfortable working with new technologies and adapting to changing requirements? (1 - Uncomfortable, 5 - Adaptable)",
      q8: "How effectively did you troubleshoot and debug technical problems that occurred? (1 - Ineffectively, 5 - Efficiently)",
      q9: "Did you demonstrate a strong understanding of software development best practices? (1 - Weak, 5 - Strong)",
      q10: "How well did you document your work (code, designs, etc.)? (1 - Poorly, 5 - Very Well)",
    };

    const roleBasedQuestions = {
      sr_software_engineer: {
        q1: "How well did you follow coding standards and best practices? (1 - Not at all, 5 - Always)",
        q2: "Did you actively participate in code reviews and provide constructive feedback? (1 - Rarely, 5 - Consistently)",
        q3: "Open Ended: What technical challenges did you encounter during the project, and how did you overcome them?",
        q4: "Open Ended: Describe a specific instance where you went above and beyond your assigned tasks.",
        q5: "Open Ended: What areas of your technical skillset would you like to focus on for future development?",
      },
      software_engineer: {
        q1: "How well did you follow coding standards and best practices? (1 - Not at all, 5 - Always)",
        q2: "Did you actively participate in code reviews and provide constructive feedback? (1 - Rarely, 5 - Consistently)",
        q3: "Open Ended: What technical challenges did you encounter during the project, and how did you overcome them?",
        q4: "Open Ended: Describe a specific instance where you went above and beyond your assigned tasks.",
        q5: "Open Ended: What areas of your technical skillset would you like to focus on for future development?",
      },
      solution_enabler: {
        q1: "How effectively did you translate business needs into technical solutions? (1 - Poorly, 5 - Excellently)",
        q2: "How well did you manage your workload and prioritize tasks effectively? (1 - Poorly, 5 - Very Well)",
        q3: "Open Ended: Can you share what project needs to make the delivery better?",
        q4: "Open Ended: How can communication between technical and non-technical teams be improved to ensure everyone is aligned on project goals?",
        q5: "Open Ended: Describe about technical and business challenges in the project.",
      },
      tribe_master: {
        q1: "How well is the project progressing within the tribe? (1 - Poor, 5 - Excellent)",
        q2: "How effective are the deliverables and client interactions within your tribe? (1 - Poor, 5 - Excellent)",
        q3: "Open Ended: How would you describe the overall health and morale of your tribe?",
        q4: "Open Ended: What specific actions did you take to foster collaboration and knowledge sharing within your tribe?",
        q5: "Open Ended: What can be done to improve your tribe's overall performance?",
      },
    };

    if (userRole && roleBasedQuestions[userRole]) {
      const commonQuestionCount = Object.keys(commonQuestions).length;
      const roleQuestions = roleBasedQuestions[userRole];
      const mergedQuestions = {
        ...commonQuestions,
        ...Object.keys(roleQuestions).reduce((acc, key, index) => {
          acc[`q${commonQuestionCount + index + 1}`] = roleQuestions[key];
          return acc;
        }, {}),
      };
      setQuestions(mergedQuestions);
    } else {
      setQuestions(commonQuestions);
    }

    setIsLoading(false);
  }, [userRole]);

  const handleStarClick = (questionKey, value) => {
    setActiveStars((prevActiveStars) => ({
      ...prevActiveStars,
      [questionKey]: value,
    }));
    setUserInputs((prevInputs) => ({
      ...prevInputs,
      [questionKey]: value,
    }));
  };

  const handleTextareaChange = (event) => {
    const { id, value } = event.target;
    setUserInputs((prevInputs) => ({
      ...prevInputs,
      [id]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if all questions have entries in userInputs
    const allQuestionsAnswered = Object.keys(questions).every(questionKey =>
      userInputs.hasOwnProperty(questionKey)
    );

    if (!allQuestionsAnswered) {
      // If any question is missing in userInputs, prevent form submission and display a message
      alert("Please answer all questions before submitting.");
      return; // Exit the function early
    }

    // If all questions have entries in userInputs, proceed with form submission

    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    const mondayDate = new Date(currentDate); // Clone the current date
    mondayDate.setDate(currentDate.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1)); // If it's Sunday, subtract 6 days; otherwise, subtract current day of the week - 1
    const startDate = mondayDate.toISOString().split("T")[0];
    console.log("StartDate: ", startDate);

    // Calculate end date (Sunday) of the current week
    const sundayDate = new Date(mondayDate); // Clone the Monday date
    sundayDate.setDate(mondayDate.getDate() + 6); // Add 6 days to get Sunday
    const endDate = sundayDate.toISOString().split("T")[0];
    console.log("EndDate: ", endDate);

    // Prepare the data to be sent to the backend
    const feedbackData = {
      userID: userID,
      startDate: startDate,
      endDate: endDate,
      ...userInputs // Include all user inputs
    };

    // Send the feedbackData to the backend
    axios.post('http://localhost:4000/feedback-submission', feedbackData)
      .then(response => {
        console.log("Feedback submitted successfully:", response.data);
        setFeedbackMessage("Submission Succesfull")
        // Optionally, you can show a success message or redirect the user to another page
      })
      .catch(error => {
        console.error("Error submitting feedback:", error);
        // Optionally, you can show an error message to the user
      });
  };


  return (
    <div className="bodyt">
      <h1>Feedback</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : feedbackMessage ? (
        <p>{feedbackMessage}</p>
      ) : showForm ? (
        <form className="feedback-form" onSubmit={handleSubmit}>
          {Object.entries(questions).map(([key, value], index) => (
            <div key={key}>
              <label htmlFor={key}>{value}</label>
              <br />
              {index < 12 ? (
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fa-regular fa-star ${
                        i < activeStars[key] ? "active" : ""
                      }`}
                      onClick={() => handleStarClick(key, i + 1)}
                      style={{ cursor: "pointer" }}
                      aria-label={`Star ${i + 1}`}
                      role="button"
                      tabIndex={0}
                    ></i>
                  ))}
                </div>
              ) : (
                <textarea
                  id={key}
                  name={key}
                  rows="4"
                  cols="50"
                  onChange={handleTextareaChange}
                  required // Added required attribute here
                ></textarea>
              )}
            </div>
          ))}
          <button className="btn btns" type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      ) : null}
    </div>
  );
}

export default Feedback;
