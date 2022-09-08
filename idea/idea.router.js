const express = require("express");
const idea = require("./idea.controller");

const router = express.Router();

router.get("/", idea.readAllIdeas);
router.get("/:ideaId", idea.readIdea);
router.post("/", idea.createIdea);
router.put("/:ideaId", idea.updateIdea);
router.delete("/:ideaId", idea.deleteIdea);

module.exports = router;
