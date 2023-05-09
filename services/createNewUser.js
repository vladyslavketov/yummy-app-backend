// const createNewUser = async (requestBody) => {
//   const { name, email, password } = requestBody;

//   const hashPassword = await setHashPassword(password);
//   const newUser = await User.create({ name, email, password: hashPassword });
//   const payload = { id: newUser._id };
//   const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
//   const newUserWithToken = await User.findByIdAndUpdate(
//     newUser._id,
//     { token },
//     { new: true }
//   );

//   const { id, avatarUrl } = newUserWithToken;
//   console.log("newUserWithToken", newUserWithToken);

// }

// module.exports = {
//   createNewUser,
// };