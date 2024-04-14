const mongoose = require("mongoose");
require("dotenv").config();

// Define the mongoDb connection URL
const mongoURL = process.env.DB_URL;
// set up mongodb Connection
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default Connection
//Mongoose maintain a default connetion object representing the mongoDb connection

const db = mongoose.connection;

// Define Eventlistner

db.on("connected", () => {
  console.log("Database connected successfuly");
});

db.on("error", (err) => {
  console.log("Database connection error", err);
});

db.on("disconnected", () => {
  console.log("Database disconnected");
});

module.exports = db;
