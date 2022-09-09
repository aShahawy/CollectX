require("dotenv").config();
const express = require("express");
const appRouter = require("./app.router");

const app = express();
const port = 3000;

app.use(appRouter);

app.listen(port, () => {
  console.log("App started at port " + port);
});
