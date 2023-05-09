const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    avatarUrl: {
      type: String,
      default:
        "https://img.freepik.com/fotos-gratis/amor-romance-perfurado-coracao-de-papel_53876-87.jpg",
    },
    // subscription: {
    //   type: String,
    //   enum: ["starter", "pro", "business"],
    //   default: "starter",
    // },
    // verify: {
    //   type: Boolean,
    //   default: false,
    // },
    // verificationToken: {
    //   type: String,
    //   required: [true, 'Verify token is required'],
    // },

    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

setHashPassword = async function (password) {
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
  comparePassword,
};
