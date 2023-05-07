const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchGlobalError = require("../utils/catchGlobalError");
const AppError = require("./../utils/appError");

const jwtSecret = "top-32long-secret-secure-web-token";
const jwtExpires = "90d";

exports.signup = catchGlobalError(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign(
    {
      id: newUser._id,
    },
    jwtSecret,
    {
      expiresIn: jwtExpires,
    }
  );

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchGlobalError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Not valid email or password", 401));
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    jwtSecret,
    {
      expiresIn: jwtExpires,
    }
  );

  res.status(200).json({
    status: "success",
    token,
  });
});
