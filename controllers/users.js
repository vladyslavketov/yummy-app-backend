const { catchAsync, errorApp } = require("../helpers");
const { User, setHashPassword } = require("../models/user");

register = catchAsync(async (req, res) => {
  console.log("HELLO")
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) throw errorApp(409, "Email in use");
  

  // const avatarURL = gravatar.url(email);
  const hashPassword = await setHashPassword(password);
  // const verificationToken = uuidv4();
  // const newUser = await User.create({ email, password: hashPassword, avatarURL, verificationToken});

  const newUser = await User.create({ email, password: hashPassword});
  // const mail = {
  //   to: email,
  //   subject: "Confirm registration",
  //   html: `<a href="http://localhost:3000/api/users/verify/${verificationToken}" target="blank">To complete the registration, click confirm your email</a>`,
  // };

  // await sendEmail(mail);

  console.log("FAIL ?")
  res.status(201).json({ user: {email, subscription: newUser.subscription, }});
});


module.exports = {
  register,
};