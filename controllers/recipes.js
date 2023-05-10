const { catchAsync, appError } = require("../helpers");
const { Recipe } = require("../models/recipeModel");

getCategoriesPreview  = catchAsync(async (req, res) => {
  const result = await Recipe.aggregate([
    { $match: { category: {$in: ['Breakfast', 'Miscellaneous', 'Chicken', 'Dessert']} } },
    { $group: { _id: "$category", recipes: { $push: "$$ROOT" } } },
    { $project: { recipes: { $slice: ["$recipes", 4] } } },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({result});
});

module.exports = {
  getCategoriesPreview,
};
