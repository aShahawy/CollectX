const utils = require("../utils");
const prisma = require("../prismaClient");
const httpStatus = require("http-status");

const readAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    if (users) {
      const newUsers = utils.deleteAttributes(users);
      res
        .status(httpStatus.OK)
        .json({ message: httpStatus[httpStatus.OK], data: newUsers });
    } else if (users?.length == 0) {
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

const readUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.userId),
      },
      include: {
        collections: true,
      },
    });
    if (user) {
      delete user.password;
      delete user.createdAt;
      delete user.updatedAt;
      res
        .status(httpStatus.OK)
        .json({ message: httpStatus[httpStatus.OK], data: user });
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

// const deleteUser = async (req, res) => {
//   res.json(
//     await prisma.user.delete({
//       where: {
//         id: parseInt(req.params.id),
//       },
//     })
//   );
// };

module.exports = {
  readAllUsers,
  readUser,
  // deleteUser,
};
