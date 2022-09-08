const express = require("express");
const collection = require("./collection.controller");
const router = express.Router();

router.get("/", collection.readAllCollections);
router.get("/:collectionId", collection.readCollection);
router.post("/", collection.createCollection);
router.put("/:collectionId", collection.updateCollection);
router.delete("/:collectionId", collection.deleteCollection);

module.exports = router;
