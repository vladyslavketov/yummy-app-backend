const { nanoid } = require("nanoid");

const { catchAsync } = require("../helpers");
const { User } = require("../models/user");

getIngredientsShoppingList = catchAsync(async (req, res) => {
  const userId = req.user._id.toString();
  // const result = await User.findById(userId).select("shoppingList -_id");
  const result = await User.findById(userId);

  res.status(201).json(result.shoppingList);
});

addIngredientsToShoppingList = catchAsync(async (req, res) => {
  const userId = req.user._id.toString();
  const result = await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        shoppingList: { ...req.body, _id: nanoid(), baseId: req.body._id },
      },
    },
    { new: true }
  );

  res.status(201).json(result.shoppingList);
});

module.exports = {
  getIngredientsShoppingList,
  addIngredientsToShoppingList,
};
