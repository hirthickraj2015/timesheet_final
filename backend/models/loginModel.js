const mongoose = require("mongoose");

const loginDetailSchema = new mongoose.Schema({
    userID: String,
    password: String,
    otp: Number, // Change the type to Number for OTP
  });
module.exports = mongoose.model("login_details", loginDetailSchema);
