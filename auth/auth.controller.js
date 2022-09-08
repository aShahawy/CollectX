const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    // Get user input
    const { firstName, lastName, email, password, username } = req.body;

    // Validate user input
    if (!(email && password && firstName && lastName && username)) {
      // Some input is missing
      res.sendStatus(400);
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
        return res.sendStatus(409);
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
        res.status(201).json({
          id: user.id,
        });
      }
    }
  } catch (err) {
    console.log(err);
    // Internal server error
    res.sendStatus(500);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.sendStatus(400);
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Password didn't match");
        // Wrong credentials
        res.sendStatus(403);
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
        // save user token
        user.token = token;

        res.json({
          token,
        });
      }
    }
  } catch (err) {
    console.log(err);
    // Internal server error
    res.sendStatus(500);
  }
};

const updateUser = async (req, res) => {
  try {
    // Get user input
    const { firstName, lastName, password } = req.body;
    // Validate user input
    if (!(firstName && lastName && password))
      res.sendStatus(400); // Some input is missing
    else {
      // Hashing password
      encryptedPassword = await bcrypt.hash(password, 12);
      const data = { firstName, lastName, password: encryptedPassword };
      const user = await prisma.user.update({
        where: {
          id: parseInt(req.user.id),
        },
        data: data,
      });
      if (user) res.sendStatus(200);
      else res.sendStatus(400);
    }
  } catch (err) {
    console.log(err);
    // Internal server error
    res.sendStatus(500);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
};
