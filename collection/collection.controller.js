const { user, collection } = require("../prismaClient");
const prisma = require("../prismaClient");

const readAllCollections = async (req, res) => {
  try {
    const collections = await prisma.collection.findMany();
    if (collections) res.status(200).json(collections);
    else res.sendStatus(400);
  } catch (err) {
    console.log(err);
    // Internal server error
    res.sendStatus(500);
  }
};

const readCollection = async (req, res) => {
  try {
    const collection = await prisma.collection.findUnique({
      where: {
        id: parseInt(req.params.collectionId),
      },
      include: {
        ideas: true,
      },
    });
    if (collection) res.status(200).json(collection);
    else res.sendStatus(400);
  } catch (err) {
    console.log(err);
    // Internal server error
    res.sendStatus(500);
  }
};

const createCollection = async (req, res) => {
  try {
    req.body.userId = parseInt(req.user.id);
    console.log(req.user);
    const collection = await prisma.collection.create({
      data: req.body,
    });
    if (collection) res.status(201).json({ id: collection.id });
    else res.sendStatus(400);
  } catch (err) {
    console.log(err);
    // Internal server error
    res.sendStatus(500);
  }
};

const updateCollection = async (req, res) => {
  try {
    const collection = await prisma.collection.update({
      where: {
        id: parseInt(req.params.collectionId),
        userId: parseInt(req.user.id),
      },
      data: req.body,
    });
    if (collection) res.sendStatus(200);
    else res.sendStatus(400);
  } catch (err) {
    console.log(err);
    // Internal server error
    res.sendStatus(500);
  }
};

const deleteCollection = async (req, res) => {
  try {
    const collection = await prisma.collection.delete({
      where: {
        id: parseInt(req.params.collectionId),
        userId: parseInt(req.user.id),
      },
    });
    if (collection) res.sendStatus(200);
    else res.sendStatus(400);
  } catch (err) {
    console.log(err);
    // Internal server error
    res.sendStatus(500);
  }
};

module.exports = {
  readAllCollections,
  createCollection,
  readCollection,
  updateCollection,
  deleteCollection,
};
