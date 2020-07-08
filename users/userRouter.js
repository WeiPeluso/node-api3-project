const express = require("express");

const router = express.Router();
const Users = require("./userDb");
const Posts = require("../posts/postDb");

router.post("/", validateUser, (req, res) => {
  const newUser = req.body;
  Users.insert(newUser)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error adding the user",
      });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const newPost = { ...req.body, user_id: req.params.id };
  Posts.insert(newPost)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error adding the post",
      });
    });
});

router.get("/", (req, res) => {
  Users.get()
    .then((users) => {
      res.status(200).json({ data: users });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving the users",
      });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  // do your magic!
  Users.getById(req.params.id)
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving the user",
      });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json({ posts });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving the user's posts",
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: "The user has been removed" });
      } else {
        res.status(404).json({ message: "The user could not be found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error removing the user",
      });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  const updatedUser = req.body;
  Users.update(req.params.id, updatedUser)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json({
        message: "The user information could not be modified.",
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then((user) => {
      if (user !== undefined) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "Invalid User ID" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Can't connect to database", error: err });
    });
}

function validateUser(req, res, next) {
  console.log(req.body);
  const user = req.body;
  if (!user) {
    res.status(400).json({ message: "missing user data" });
  } else {
    if (!user.name) {
      res.status(400).json({ message: "missing required name field" });
    } else {
      next();
    }
  }
}

function validatePost(req, res, next) {
  const post = req.body;
  if (!post) {
    res.status(400).json({ message: "missing post data" });
  } else {
    if (!post.text) {
      res.status(400).json({ message: "missing required text field" });
    } else {
      next();
    }
  }
}

module.exports = router;
