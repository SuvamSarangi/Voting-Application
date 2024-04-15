const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const { jwtAuthMiddleware, generateToken } = require("./../jwt");
// const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  try {
    // Assuming the request body contains the User data
    const data = req.body;
    // Check if there is already an admin user
    const isAdmin = await User.findOne({ role: "admin" });
    if (data.role === 'admin' && isAdmin) {
      return res.status(400).json({ error: "Admin user already exists" });
     
    }

    // Create a new User document using the Mongoose model
    const newUser = new User(data);

    // Save the new user to the database
    const response = await newUser.save();
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
router.post("/login",jwtAuthMiddleware, async (req, res) => {
  try {
    // Extract aadharCardNumber and password from request body
    const { aadharCardNumber, password } = req.body;

    // Check if aadharCardNumber or password is missing
    // if (!aadharCardNumber || password) {
    //   return res
    //     .status(400)
    //     .json({ error: "Aadhar Card Number and password are required" });
    // }

    // Find the user by aadharCardNumber
    const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

    // If user does not exist or password does not match, return error
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ error: "Invalid Aadhar Card Number or Password" });
    }
    const payLoad = {
      id: user.id,
    };
    const token = generateToken(payLoad);
    res.status(200).json({  token: token });
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

router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    // Extract the id from the token
    const userId = req.user;
    // Extract current and new passwords from request body
    const { currentPassword, newPassword } = req.body;
    // Check if currentPassword and newPassword are present in the request body
    if (!currentPassword || !newPassword) {
      return res.res
        .status(400)
        .json({ error: "Both currentPassword and newPassword are required" });
    }
    // Find the user by userID
    const user = await User.findById(userId);
    // If user does not exist or password does not match, return error
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();
    console.log("password updated");
    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
