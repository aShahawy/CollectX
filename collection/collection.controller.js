const prisma = require("../prismaClient");
const httpStatus = require("http-status");

const readAllCollections = async (req, res) => {
  try {
    const collections = await prisma.collection.findMany();
    if (collections) {
      res
        .status(httpStatus.OK)
        .json({ message: httpStatus[httpStatus.OK], data: collections });
    } else if (collections?.length == 0) {
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
    if (collection) {
      res
        .status(httpStatus.OK)
        .json({ message: httpStatus[httpStatus.OK], data: collection });
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

const createCollection = async (req, res) => {
  try {
    req.body.userId = parseInt(req.user.id);
    console.log(req.user);
    const collection = await prisma.collection.create({
      data: req.body,
    });
    if (collection) {
      res.status(httpStatus.CREATED).json({
        message: httpStatus[httpStatus.CREATED],
        data: { id: collection.id },
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

const updateCollection = async (req, res) => {
  try {
    const collection = await prisma.collection.update({
      where: {
        id: parseInt(req.params.collectionId),
        userId: parseInt(req.user.id),
      },
      data: req.body,
    });
    if (collection) {
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

const deleteCollection = async (req, res) => {
  try {
    const collection = await prisma.collection.delete({
      where: {
        id: parseInt(req.params.collectionId),
        userId: parseInt(req.user.id),
      },
    });
    if (collection) {
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
  readAllCollections,
  createCollection,
  readCollection,
  updateCollection,
  deleteCollection,
};
