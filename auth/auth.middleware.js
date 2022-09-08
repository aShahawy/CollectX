const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.auth;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      // Token verification failed (not authenticated)
      console.log("Have token");
      if (err) res.sendStatus(403);
      else {
        console.log("Have a valid token");
        req.user = user;
        next();
      }
    });
  }
  // No token provided (not authenticated)
  else {
    res.sendStatus(403);
    console.log("No token");
  }
};

module.exports = auth;
