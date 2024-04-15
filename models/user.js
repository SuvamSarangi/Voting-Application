const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  aadharCardNumber: {
    type: Number,
    required: true,
    unqiue: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  // Hash the password only if it has been modified (or is new)
  if (!user.isModified("password")) {
    next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    // hash password
    const hashPassword = await bcrypt.hash(user.password, salt);
    //Override the plain password with hashed password
    user.password = hashPassword;
  } catch (err) {
    next(err);
  }
});

//Function Compaire the password with the user password
userSchema.methods.comparePassword = (async function(userPassword){
  try {
    // Use bcrypt to compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
});

const User = mongoose.model("user", userSchema);
module.exports = User;
