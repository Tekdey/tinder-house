const router = require("express").Router();
const Post = require("../controllers/post.controllers");

// router.get("/fetch/:id", Post.getPosts_bienIci);
router.get("/fetch/", Post.nexity);

module.exports = router;
