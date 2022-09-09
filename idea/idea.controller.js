const prisma = require("../prismaClient");
const httpStatus = require("http-status");

const readAllIdeas = async (req, res) => {
  try {
    const ideas = await prisma.idea.findMany({
      where: {
        collectionId: parseInt(req.collectionId),
      },
    });
    if (ideas) {
      res
        .status(httpStatus.OK)
        .json({ message: httpStatus[httpStatus.OK], data: ideas });
    } else if (ideas?.length == 0) {
      res.status(httpStatus.OK).json({ message: httpStatus[httpStatus.OK] });
    } else {
      throw new Error("Unknown error while getting all users");
    }
  } catch (err) {
    console.log(err);
    // Internal server error
    next(err);
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
    if (idea) {
      res
        .status(httpStatus.OK)
        .json({ message: httpStatus[httpStatus.OK], data: idea });
    } else {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ message: httpStatus[httpStatus.NOT_FOUND] });
    }
  } catch (err) {
    console.log(err);
    // Internal server error
    next(err);
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
    if (idea) {
      res.status(httpStatus.CREATED).json({
        message: httpStatus[httpStatus.CREATED],
        data: { id: idea.id },
      });
    } else {
      res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: httpStatus[httpStatus.BAD_REQUEST] });
    }
  } catch (err) {
    console.log(err);
    // Internal server error
    next(err);
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
    if (idea) {
      res.status(httpStatus.OK).json({ message: httpStatus[httpStatus.OK] });
    } else {
      res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: httpStatus[httpStatus.BAD_REQUEST] });
    }
  } catch (err) {
    console.log(err);
    // Internal server error
    next(err);
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
    if (idea) {
      res
        .status(httpStatus.NO_CONTENT)
        .json({ message: httpStatus[httpStatus.NO_CONTENT] });
    } else {
      res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: httpStatus[httpStatus.BAD_REQUEST] });
    }
  } catch (err) {
    console.log(err);
    // Internal server error
    next(err);
  }
};

module.exports = {
  readAllIdeas,
  createIdea,
  readIdea,
  updateIdea,
  deleteIdea,
};
