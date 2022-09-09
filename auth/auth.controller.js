const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");
const httpStatus = require("http-status");

const registerUser = async (req, res) => {
  try {
    // Get user input
    const { firstName, lastName, email, password, username } = req.body;

    // Validate user input
    if (!(email && password && firstName && lastName && username)) {
      // Some input is missing
      res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: httpStatus[httpStatus.BAD_REQUEST] });
    } else {
      // check if user already exist
      // Validate if user exist in our database
      const oldUserWithEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      const oldUserWithUsername = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (oldUserWithEmail?.email || oldUserWithUsername?.email) {
        // User having the same email or password already exist
        res
          .status(httpStatus.CONFLICT)
          .json({ error: httpStatus[httpStatus.CONFLICT] });
        return;
      } else {
        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 12);

        // Create user in our database
        const user = await prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            password: encryptedPassword,
            username,
          },
        });

        // return new user
        res.status(httpStatus.CREATED).json({
          message: httpStatus[httpStatus.CREATED],
          data: { id: user.id },
        });
      }
    }
  } catch (err) {
    console.log(err);
    // Internal server error
    next(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: httpStatus[httpStatus.BAD_REQUEST] });
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Wrong credentials
        res
          .status(httpStatus.UNAUTHORIZED)
          .json({ error: httpStatus[httpStatus.UNAUTHORIZED] });
      } else {
        // Create token
        const { id, username } = user;
        const token = jwt.sign(
          { id, username, email },
          process.env.TOKEN_SECRET,
          {
            expiresIn: "2h",
          }
        );
        // // save user token
        // user.token = token;
        res.status(httpStatus.ACCEPTED).json({
          message: httpStatus[httpStatus.ACCEPTED],
          data: { token },
        });
      }
    }
  } catch (err) {
    console.log(err);
    // Internal server error
    next(err);
  }
};

const updateUser = async (req, res) => {
  try {
    // Get user input
    const { firstName, lastName, password } = req.body;
    // Validate user input
    if (!(firstName && lastName && password)) {
      // Some input is missing
      res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: httpStatus[httpStatus.BAD_REQUEST] });
    } else {
      // Hashing password
      encryptedPassword = await bcrypt.hash(password, 12);
      const data = { firstName, lastName, password: encryptedPassword };
      const user = await prisma.user.update({
        where: {
          id: parseInt(req.user.id),
        },
        data: data,
      });
      if (user) {
        res.status(httpStatus.OK).json({ message: httpStatus[httpStatus.OK] });
      } else {
        res
          .status(httpStatus.BAD_REQUEST)
          .json({ error: httpStatus[httpStatus.BAD_REQUEST] });
      }
    }
  } catch (err) {
    console.log(err);
    // Internal server error
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
};
