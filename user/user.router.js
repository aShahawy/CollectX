const express = require("express");
const user = require("./user.controller");

const router = express.Router();

router.get("/", user.readAllUsers);
router.get("/:userId", user.readUser);
// router.put("/:userId", user.updateUser);
// router.delete("/:userId", user.deleteUser);

module.exports = router;
