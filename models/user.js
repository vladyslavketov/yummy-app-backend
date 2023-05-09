const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    // avatarURL: {
    //   type: String,
    //   required: true,
    // },
    token: {
      type: String,
      default: "",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    // verificationToken: {
    //   type: String,
    //   required: [true, 'Verify token is required'],
    // },
  },
  { versionKey: false }
);

setHashPassword = async function (password) {
  // console.log("password = ", password)
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
comparePassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

const User = model("user", userSchema);

module.exports = {
  User,
  setHashPassword,
  comparePassword
};