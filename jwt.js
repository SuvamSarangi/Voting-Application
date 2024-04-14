const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  // first check request headers has autherization or not
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ error: "Invalid Token" });
  }
  // Extract jwt token fron request header
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Verify the token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user information to the request object  (decoded value)
    req.user = decode;
    next(); // send it to server
  } catch (err) {
    console.log(err);
    res.status(401).json({ err: "Invalid Token" });
  }
};

// Function to generate JWT token
const generateToken = (userData) => {
  const token = jwt.sign(userData, JWT_SECRET);
};

module.exports = { jwtAuthMiddleware, generateToken };
