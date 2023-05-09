const jwt = require("jsonwebtoken");
const { catchAsync, appError } = require("../helpers");
const { User, setHashPassword, comparePassword } = require("../models/user");
const { SECRET_KEY } = process.env;

register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) throw appError(409, "Email in use");

  const hashPassword = await setHashPassword(password);
  const newUser = await User.create({ name, email, password: hashPassword });
  const payload = { id: newUser._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  const newUserWithToken = await User.findByIdAndUpdate(
    newUser._id,
    { token },
    { new: true }
  );
  const { id, avatarUrl } = newUserWithToken;

  res.status(201).json({
    user: { name, email, avatarUrl },
    token,
  });
});

login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw appError(401, "Email or password is wrong");

  const comparedPassword = await comparePassword(password, user.password);
  if (!comparedPassword) throw appError(401, "Email or password is wrong");

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  const { name, avatarUrl } = user;
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    user: { name, email, avatarUrl },
    token,
  });
});

getCurrent = catchAsync(async (req, res) => {
  const { name, email, avatarUrl } = req.user;

  res.status(200).json({name, email, avatarUrl });
});

logout = catchAsync(async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    throw AppError(401, "Not authorized");
  }

  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
});

module.exports = {
  register,
  login,
  getCurrent,
  logout,
};
