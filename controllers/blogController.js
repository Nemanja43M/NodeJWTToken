const Blog = require("./../models/blogModel");

exports.getBlogGroup = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
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
