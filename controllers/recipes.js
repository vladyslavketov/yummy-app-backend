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

getRecipesByCategory  = catchAsync(async (req, res) => {
  // const { category, skip, limit} = req.params;
  const { category } = req.params;
  const normalizeCategory = category.replace(/^\w/, (c) => c.toUpperCase());

  let { page = 1, limit = 8 } = req.query;
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  const result = await Recipe.aggregate([
    { $match: { category: normalizeCategory} },
    { $setWindowFields: { output: { totalCount: { $count: {} } } } },
    { $skip: skip },
    { $limit: limit },
  ]);

  res.status(200).json({result});
});

module.exports = {
  getCategoriesPreview,
  getRecipesByCategory,
};
