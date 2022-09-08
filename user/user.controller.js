const { user } = require("../prismaClient");
const prisma = require("../prismaClient");

const readAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    if (users) {
      const newUsers = deleteAttributes(users);
      res.status(200).json(newUsers);
    } else res.sendStatus(400);
  } catch (err) {
    console.log(err);
    // Internal server error
    res.sendStatus(500);
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
      res.status(200).json(user);
    } else res.sendStatus(400);
  } catch (err) {
    console.log(err);
    // Internal server error
    res.sendStatus(500);
  }
};

const deleteAttributes = (users) => {
  return users.map((user) => {
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    return user;
  });
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
