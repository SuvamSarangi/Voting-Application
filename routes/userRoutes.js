const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const { jwtAuthMiddleware, generateToken } = require("./../jwt");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  try {
    // Assuming the request body contains the User data
    const data = req.body;

    // Create a new User document using the Mongoose model
    const newUser = new User(data);

    // Save the new user to the database
    const response = newUser.save();
    console.log("data saved");

    const payLoad = {
      id: response.id,
    };
    const token = generateToken(payLoad);
    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Login route
router.post("login", async (req, res) => {
  try {
    // Extract aadharCardNumber and password from request body
    const { aadharCardNumber, password } = req.body;

    // Check if aadharCardNumber or password is missing
    if (!aadharCardNumber || password) {
      return res
        .status(400)
        .json({ error: "Aadhar Card Number and password are required" });
    }

    // Find the user by aadharCardNumber
    const user = await User.find({ aadharCardNumber: aadharCardNumber });

    // If user does not exist or password does not match, return error
    if (!user || !(await user.bcrypt.compare(password))) {
      return res
        .status(401)
        .json({ error: "Invalid Aadhar Card Number or Password" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (err) {
    console.log("saved failed", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/profile/password", (req, res) => {
  try {
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
