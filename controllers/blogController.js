const Blog = require("./../models/blogModel");

exports.getAllBlogs = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const exludedField = ["sort", "page"];
    exludedField.forEach((el) => delete queryObj[el]);

    let query = Blog.find(queryObj);

    const page = req.query.page * 1 || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numBlogs = await Blog.countDocuments();
      console.log(numBlogs);
      if (skip >= numBlogs) throw new Error("This page does not exists");
    }

    const allBlogs = await query;

    res.status(200).json({
      status: "success",
      results: allBlogs.length,
      data: {
        allBlogs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        blog,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.createBlog = async (req, res) => {
  try {
    console.log(req.body);
    const newBlog = await Blog.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        newBlog: newBlog,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        updatedBlog,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
