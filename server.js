const express = require("express");
const db = require("./db");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 8080;
app.use(bodyParser.json());


// import router file
const userRouter = require("./routes/userRoutes");
const candidateRoute = require("./routes/candidateRoutes");

// use the router
app.use("/user", userRouter);
app.use("/candidate",candidateRoute);

app.listen(PORT, () => {
  console.log("server started");
});
