const { promisify } = require("util");
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
    role: req.body.role,
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

exports.protect = catchGlobalError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, jwtSecret);

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You have mot permission to perform this action", 403)
      );
    }

    next();
  };
};
