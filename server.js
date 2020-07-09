const express = require("express");

const server = express();

const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");

server.use(express.json());

server.use(logger);

server.use("/api/user", userRouter);
server.use("/api/post", postRouter);

const message = process.env.MESSAGE;

server.get("/", (req, res) => {
  res.send(`<h2>${message}/h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `${req.method} to ${req.url} from ${
      req.hostname
    } at [${new Date().toISOString()}]`
  );
  next();
}

module.exports = server;
