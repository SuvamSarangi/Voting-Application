const express = require("express");
// const db = require("./db");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("server started");
});
