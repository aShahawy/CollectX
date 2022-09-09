const express = require("express");
const httpStatus = require("http-status");
const user = require("./user/user.router");
const collection = require("./collection/collection.router");
const idea = require("./idea/idea.router");
const auth = require("./auth/auth.router");
const authMiddleware = require("./auth/auth.middleware");

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use((req, res, next) => {
  console.log(req.path);
  next();
});

// Register and login
router.use("/auth", auth);
// User profiles
router.use("/users", authMiddleware, user);
// Collections CRUD
router.use("/collections", authMiddleware, collection);
// Ideas CRUD
router.use(
  "/collections/:collectionId/ideas",
  authMiddleware,
  (req, res, next) => {
    req.collectionId = req.params.collectionId;
    next();
  },
  idea
);

router.all("*", (req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    error: httpStatus[httpStatus.NOT_FOUND],
  });
});

router.use((err, req, res, next) => {
  console.log(err);
  res
    .status(httpStatus.INTERNAL_SERVER_ERROR)
    .json({ error: httpStatus[httpStatus.INTERNAL_SERVER_ERROR] });
});
// router.get("/test", authMiddleware, (req, res) => {
//   console.log(req.user);
//   res.sendStatus(200);
// });

module.exports = router;
