require("dotenv").config();
const express = require("express");
const user = require("./user/user.router");
const collection = require("./collection/collection.router");
const idea = require("./idea/idea.router");
const auth = require("./auth/auth.router");
const authMiddleware = require("./auth/auth.middleware");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  console.log(req.path);
  next();
});

// Register and login
app.use("/auth", auth);
// User profiles
app.use("/users", authMiddleware, user);
// Collections CRUD
app.use("/collections", authMiddleware, collection);
// Ideas CRUD
app.use(
  "/collections/:collectionId/ideas",
  authMiddleware,
  (req, res, next) => {
    req.collectionId = req.params.collectionId;
    next();
  },
  idea
);

app.get("/hello", authMiddleware, (req, res) => {
  console.log(req.user);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log("App started at port " + port);
});
