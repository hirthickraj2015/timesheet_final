const UserDetails = require("../models/userModel");
const LoginDetail = require("../models/loginModel");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "hirthickraj2015@gmail.com",
    pass: "qqgo exwu daqk zljb",
  },
  logger: true,
});

exports.addUser = async (req, res) => {
  try {
    const { userID, firstName, lastName, dob, mailID, gender, role } = req.body;

    // Check if the user already exists
    const existingUser = await UserDetails.findOne({ userID });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    let defaultPassword = "0000"; // Default password for new user

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Create a new user in UserDetails collection
    const newUser = new UserDetails({
      userID,
      firstName,
      lastName,
      dob,
      mailID,
      gender,
      role,
    });
    await newUser.save();

    // Create a new login entry for the user in LoginDetail collection with generated OTP
    const newLoginDetail = new LoginDetail({
      userID,
      password: defaultPassword,
      otp,
    });
    await newLoginDetail.save();

    // Send email with OTP and reset password link
    const mailOptions = {
      from: "hirthickraj2015@gmail.com", // Update with your email address
      to: mailID,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${newLoginDetail.otp}. Click on the following link to reset your password: http://localhost:3000/resetPassword/${userID}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({ message: "User added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { userID, password } = req.body;
    const user = await LoginDetail.findOne({ userID, password });
    if (user) {
      // If user exists in login_details collection, fetch role from user_details collection
      const userDetails = await UserDetails.findOne({ userID });
      if (userDetails) {
        const { role } = userDetails;
        res.status(200).json({ message: "Login successful", role });
      } else {
        res.status(401).json({ error: "User details not found" });
      }
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { userID } = req.body;
    // Generate a new OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000);
    // Update the OTP in the database
    await LoginDetail.updateOne({ userID }, { otp: newOTP });
    // Fetch user details to get email address
    const userDetails = await UserDetails.findOne({ userID });
    if (!userDetails) {
      return res.status(404).json({ error: "User not found" });
    }
    // Send email with new OTP
    const mailOptions = {
      from: "hirthickraj2015@gmail.com",
      to: userDetails.mailID,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${newOTP}. Click on the following link to reset your password: http://localhost:3000/resetPassword/${userID}`,
    };
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send OTP email" });
      }
      console.log("Email sent:", info.response);
      // Store the OTP in the database
      const user = await LoginDetail.findOne({ userID });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.otp = newOTP;
      await user.save();
      return res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { userID, otp, newPassword } = req.body;
    // Log userID to check if it's received correctly
    // Find the user in the login_details collection
    console.log(userID);
    const user = await LoginDetail.findOne({ userID });
    if (!user) {
      console.log(user);
      return res.status(404).json({ error: "User not found" });
    }
    // Check if the provided OTP matches the stored OTP
    const otp2 = parseInt(otp, 10);
    if (user.otp !== otp2) {
      console.log(user.otp, otp2);
      return res.status(400).json({ error: "Incorrect OTP" });
    }

    // Update the user's password with the new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const userID = req.params.userID;

    // Fetch user details based on userID
    const userDetails = await UserDetails.findOne({ userID });
    if (!userDetails) {
      return res.status(404).json({ error: "User not found" });
    }

    // Pass user details to the feedback route
    res.status(200).json(userDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllUserDetails = async (req,res) =>{
  try {
    const users = await UserDetails.find();
    res.status(200).json(users);
    console.log("users",users)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};