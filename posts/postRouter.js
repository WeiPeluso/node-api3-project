const express = require("express");

const router = express.Router();

const Posts = require("./postDb");

router.get("/", (req, res) => {
  Posts.get()
    .then((posts) => {
      res.status(200).json({ posts });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving the posts",
      });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  Posts.getById(req.params.id)
    .then((post) => {
      res.status(200).json({ post });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving the user",
      });
    });
});

router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: "The post has been removed" });
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error removing the post",
      });
    });
});

router.put("/:id", (req, res) => {
  const updatedPost = req.body;
  Posts.update(req.params.id, updatedPost)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(500).json({
        message: "The user information could not be modified.",
      });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  Posts.getById(req.params.id)
    .then((post) => {
      if (post !== undefined) {
        req.post = post;
        next();
      } else {
        res.status(400).json({ message: "Invalid post ID" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Can't connect to database", error: err });
    });
}

module.exports = router;
