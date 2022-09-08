const { user, idea } = require("../prismaClient");
const prisma = require("../prismaClient");

const readAllIdeas = async (req, res) => {
  try {
    const ideas = await prisma.idea.findMany({
      where: {
        collectionId: parseInt(req.collectionId),
      },
    });
    if (ideas) res.status(200).json(ideas);
    else res.sendStatus(400);
  } catch (err) {
    console.log(err);
    // Internal server error
    res.sendStatus(500);
  }
};

const readIdea = async (req, res) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: {
        id: parseInt(req.params.ideaId),
        collectionId: parseInt(req.collectionId),
      },
    });
    if (idea) res.status(200).json(idea);
    else res.sendStatus(400);
  } catch (err) {
    console.log(err);
    // Internal server error
    res.sendStatus(500);
  }
};

const createIdea = async (req, res) => {
  try {
    req.body.userId = parseInt(req.user.id);
    req.body.collectionId = parseInt(req.collectionId);
    console.log(req.user);
    const idea = await prisma.idea.create({
      data: req.body,
    });
    if (idea) res.status(201).json({ id: idea.id });
    else res.sendStatus(400);
  } catch (err) {
    console.log(err);
    // Internal server error
    res.sendStatus(500);
  }
};

const updateIdea = async (req, res) => {
  try {
    const idea = await prisma.idea.update({
      where: {
        id: parseInt(req.params.ideaId),
        userId: parseInt(req.user.id),
        collectionId: parseInt(req.collectionId),
      },
      data: req.body,
    });
    if (idea) res.sendStatus(200);
    else res.sendStatus(400);
  } catch (err) {
    console.log(err);
    // Internal server error
    res.sendStatus(500);
  }
};

const deleteIdea = async (req, res) => {
  try {
    const idea = await prisma.idea.delete({
      where: {
        id: parseInt(req.params.ideaId),
        userId: parseInt(req.user.id),
        collectionId: parseInt(req.collectionId),
      },
    });
    if (idea) res.sendStatus(200);
    else res.sendStatus(400);
  } catch (err) {
    console.log(err);
    // Internal server error
    res.sendStatus(500);
  }
};

module.exports = {
  readAllIdeas,
  createIdea,
  readIdea,
  updateIdea,
  deleteIdea,
};
