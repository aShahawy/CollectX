const express = require("express");
const auth = require("./auth.controller");
const authMiddleware = require("./auth.middleware");

const router = express.Router();

router.post("/register", auth.registerUser);
router.post("/login", auth.loginUser);
router.put("/update", authMiddleware, auth.updateUser);

module.exports = router;
