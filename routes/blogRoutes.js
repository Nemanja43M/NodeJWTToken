const express = require("express");
const blogController = require("../controllers/blogController");
const router = express.Router();
const authController = require("./../controllers/authController");

router.route("/blog-group").get(blogController.getBlogGroup);

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("Admin", "Moderator", "Guest"),
    blogController.getAllBlogs
  )
  .post(
    authController.protect,
    authController.restrictTo("Admin", "Moderator"),
    blogController.createBlog
  );

router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("Admin", "Moderator", "Guest"),
    blogController.getBlog
  )
  .patch(
    authController.protect,
    authController.restrictTo("Admin", "Moderator"),
    blogController.updateBlog
  )
  .delete(
    authController.protect,
    authController.restrictTo("Admin", "Moderator"),
    blogController.deleteBlog
  );

module.exports = router;
