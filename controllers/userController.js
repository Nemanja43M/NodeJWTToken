const User = require("../models/userModel");
const catchGlobalError = require("../utils/catchGlobalError");
const AppError = require("../utils/appError");

exports.getAllUsers = catchGlobalError(async (req, res, next) => {
  const allUsers = await User.find();

  res.status(200).json({
    status: "success",
    results: allUsers.length,
    data: {
      data: allUsers,
    },
  });
});

exports.getUser = catchGlobalError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No user find with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.createUser = catchGlobalError(async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      newUser,
    },
  });
});

exports.updateUser = catchGlobalError(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError("No user find with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
});
exports.deleteUser = catchGlobalError(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("No user find with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
