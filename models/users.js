const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const HttpError = require("../helpers/HttpError");
const { User } = require("../schemas/ValidateAuth");
const { SECRET_KEY, BASE_URL } = require("../constants/env");
const resizeImagesJimp = require("../helpers/resizeImagesJimp");
const sendEmail = require("../helpers/hodemailer");

const ifIsResult = (result) => {
  if (!result) {
    throw HttpError(404);
  }
};

const verificationToken = nanoid();

const registerUserInDB = async (body) => {
  const { password, email } = body;
  const avatarUrl = gravatar.url(email);
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    ...body,
    password: hashedPassword,
    avatarUrl,
    verificationToken,
  });

  await sendEmail({
    to: "sashka.bigas@gmail.com",
    subject: "Verify your email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click here to verify you email</a>`,
  });

  ifIsResult(newUser);
  return newUser;
};

const loginUserInDB = async (body) => {
  const { email, password, verify, verificationToken } = body;
  if (verify !== true && verificationToken !== null) {
    throw HttpError(403, "You must verify your email.");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }
  const token = jwt.sign({ id: user._id }, SECRET_KEY, {
    expiresIn: "24h",
  });
  await User.findByIdAndUpdate(user._id, { token });
  const result = { token, user: { email, subscription: user.subscription } };
  return result;
};

const logoutFromDB = async (user) => {
  const { _id } = user;
  const result = await User.findByIdAndUpdate(_id, { token: "" });
  return result;
};

const updateUserSubscriptionInDB = async ({
  user: { _id },
  params: { userId },
  body: { subscription },
}) => {
  if (_id.toString() !== userId) {
    throw HttpError(403);
  }
  const result = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );
  return result;
};

const uploadUserAvatarInDB = async (req) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const avatarDir = path.join(__dirname, "../", "public", "avatars");
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, filename);
  await fs.rename(tempUpload, resultUpload);

  await resizeImagesJimp(resultUpload, 250);

  const avatarUrl = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarUrl }, { new: true });
  return avatarUrl;
};

const verifyUserInDB = async (verificationToken) => {
  const ifIsUser = await User.findOne({ verificationToken });
  if (!ifIsUser) {
    throw HttpError(404);
  }
  await User.findOneAndUpdate(
    { verificationToken },
    { verificationToken: null, verify: true },
    { new: true }
  );
};

module.exports = {
  registerUserInDB,
  loginUserInDB,
  logoutFromDB,
  updateUserSubscriptionInDB,
  uploadUserAvatarInDB,
  verifyUserInDB,
};
