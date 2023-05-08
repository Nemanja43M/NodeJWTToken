const Blog = require("./../models/blogModel");
const catchGlobalError = require("../utils/catchGlobalError");
const AppError = require("../utils/appError");

exports.getBlogGroup = catchGlobalError(async (req, res, next) => {
  const stats = await Blog.aggregate([
    {
      $group: {
        _id: "$group",
        totalBlog: { $sum: 1 },
        numRatings: { $sum: "$likes" },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getAllBlogs = catchGlobalError(async (req, res, next) => {
  const queryObj = { ...req.query };
  const exludedField = ["page", "limit"];
  exludedField.forEach((el) => delete queryObj[el]);

  let query = Blog.find(queryObj);

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const allBlogs = await query;

  res.status(200).json({
    status: "success",
    results: allBlogs.length,
    data: {
      allBlogs,
    },
  });
});

exports.getBlog = catchGlobalError(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new AppError("No Blog find with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});
exports.createBlog = catchGlobalError(async (req, res, next) => {
  const newBlog = await Blog.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      newBlog: newBlog,
    },
  });
});

exports.updateBlog = catchGlobalError(async (req, res, next) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedBlog) {
    return next(new AppError("No Blog find with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      updatedBlog,
    },
  });
});
exports.deleteBlog = catchGlobalError(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    return next(new AppError("No Blog find with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.likeBlog = catchGlobalError(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new AppError("No Blog find with that ID", 404));
  }

  blog.likes++;
  console.log(blog);

  res.status(201).json({
    status: "success",
    data: {
      blog: blog,
    },
  });
});
