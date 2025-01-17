const HttpError = require("../helpers/HttpError");
const {
  registerUserInDB,
  loginUserInDB,
  logoutFromDB,
  updateUserSubscriptionInDB,
  uploadUserAvatarInDB,
  verifyUserInDB,
  resendingVerifyEmail,
} = require("../models/users");

const registerUser = async (req, res, next) => {
  try {
    const newUser = await registerUserInDB(req.body);
    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      next(HttpError(409, "Email is already taken"));
    }
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    await verifyUserInDB(req.params);
    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const result = await loginUserInDB(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await logoutFromDB(req.user);
    res.status(204).json();
    next();
  } catch (error) {
    next(error);
  }
};

const updateUserSubscription = async (req, res, next) => {
  console.log("it is patch favorite");
  try {
    const result = await updateUserSubscriptionInDB(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const uploadUserAvatar = async (req, res, next) => {
  try {
    const avatarUrl = await uploadUserAvatarInDB(req);
    res.status(200).json({ avatarUrl });
  } catch (error) {
    next(error);
  }
};

const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    await resendingVerifyEmail(email);
    res.status(200).json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  getCurrent,
  logout,
  updateUserSubscription,
  uploadUserAvatar,
  resendVerifyEmail,
};
