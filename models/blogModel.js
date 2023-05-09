const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A blog must have a title"],
  },
  author: {
    type: String,
    required: [true, "A blog must have a author"],
  },
  body: {
    type: String,
    required: [true, "A blog must have a text"],
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  likes: {
    type: Number,
    default: 0,
  },
  group: {
    type: String,
    enum: {
      values: ["Regular", "Important"],
    },
    required: [true, "Group is either: Regular or Important"],
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
