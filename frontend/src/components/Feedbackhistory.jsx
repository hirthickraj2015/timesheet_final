import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Feedbackhistory.css";

function Feedbackhistory() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const { userID } = useParams();
  const [userRole, setUserRole] = useState(null);
  const [fullName, setFullName] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null); // State to store selected feedback for modal
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    // Fetch feedbacks for the user
    axios
      .post("http://localhost:4000/feedback-history", { userID })
      .then((response) => {
        setFeedbacks(response.data.feedback);
        setIsLoading(false); // Update loading state when data is fetched
      })
      .catch((error) => {
        setError("Error fetching feedbacks");
        setIsLoading(false); // Update loading state even in case of error
      });
  }, [userID]);

  useEffect(() => {
    console.log("Selected Feedback", selectedFeedback);
  }, [selectedFeedback]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/user-details/${userID}`)
      .then((response) => {
        const { firstName, lastName } = response.data;
        setFullName(`${firstName} ${lastName}`);
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

  // Function to handle opening the modal and setting selected feedback
  const handleOpenModal = (feedback) => {
    setSelectedFeedback(feedback);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setSelectedFeedback(null);
  };
  // Function to format the user's role
const formatRole = (role) => {
 if (role) {
    return role
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
 }
 return ''; // Return an empty string or a default value if role is null
};


  return (
    <div className="bodyts">
      <h2>Feedback History</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <div>Error: {error}</div>}
          {feedbacks && feedbacks.length > 0 ? (
            <div className="feedback-cards">
              {feedbacks.map((feedback, index) => (
                <div key={index} className="card mb-3">
                <div className="card-body">
                   <h5 className="card-title">{fullName}</h5>
                   {userRole && <p className="user-role" style={{color:"#6a6c71"}}>{formatRole(userRole)}</p>} {/* Only call formatRole if userRole is not null */}
                   <p className="card-text" style={{ color: "#19105b" }}>
                     Start Date:{" "}
                     <b style={{color:"#6a6c71"}}>{new Date(feedback.startDate).toLocaleDateString()}</b>
                   </p>
                   <p className="card-text" style={{ color: "#19105b" }}>
                     End Date:{" "}
                     <b style={{color:"#6a6c71"}}>{new Date(feedback.endDate).toLocaleDateString()}</b>
                   </p>
                   <center>
                     <button
                       className="btn btn-primary"
                       onClick={() => handleOpenModal(feedback)}
                     >
                       <strong style={{fontSize:"15px"}}>View Feedback</strong>
                     </button>
                   </center>
                </div>
               </div>
              ))}
            </div>
          ) : (
            <p>No feedback found</p>
          )}
        </>
      )}
      {/* Modal */}
      {selectedFeedback && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          onClick={handleCloseModal}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Feedback Details</h5>
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {Object.keys(selectedFeedback).map((key) => {
                  if (key.startsWith("q")) {
                    // Assuming the key is the question number and the value is the answer
                    const questionNumber = parseInt(key.slice(1)); // Extracting the question number
                    const question = questions && questions[key];
                    const answer = selectedFeedback[key];
                    // Determine if the question is one of the last three
                    const isLastThreeQuestions =
                      questionNumber >= Object.keys(questions).length - 2;
                    return (
                      <div key={key}>
                        <p>
                          Q{questionNumber}: {question}
                        </p>
                        <p className="answer-text">
                          Ans: {answer}
                          {!isLastThreeQuestions && "/5"}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              <div className="modal-footer">
                <center>
                  <button
                    type="button"
                    className="btn btn-secondary btndt"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </center>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feedbackhistory;
