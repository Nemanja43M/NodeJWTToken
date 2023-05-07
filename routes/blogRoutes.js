const express = require("express");
const blogController = require("../controllers/blogController");
const router = express.Router();

router.route("/blog-group").get(blogController.getBlogGroup);

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(blogController.createBlog);

router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(blogController.updateBlog)
  .delete(blogController.deleteBlog);

module.exports = router;
