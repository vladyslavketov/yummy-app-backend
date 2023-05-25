const { mongoose } = require("mongoose");

const { catchAsync, appError } = require("../helpers");
const { Recipe } = require("../models/recipeModel");

getFavorite = catchAsync(async (req, res) => {
  const id = req.user._id.toString();
  let { page = 1, limit = 4 } = req.query;

  limit = parseInt(limit);

  const skip = (page - 1) * limit;
  const userFavoriteRecipes = await Recipe.aggregate([
    {
      $match: {
        "favorites.userId": id,
      },
    },

    { $setWindowFields: { output: { totalCount: { $count: {} } } } },
    { $skip: skip },
    { $limit: limit },
  ]);

  res.status(200).json({ userFavoriteRecipes });
});

addToFavorite = catchAsync(async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user._id.toString();

  if (!mongoose.Types.ObjectId.isValid(recipeId))
    throw appError(409, `Recipe id:${recipeId} not found`);

  const { favorites } = await Recipe.findOne({ _id: recipeId });
  const isInFavorites = favorites.some(
    (favorite) => favorite.userId === userId
  );

  if (isInFavorites)
    throw appError(409, `Recipe id:${recipeId} already added to favorites`);

  const result = await Recipe.findByIdAndUpdate(
    recipeId,
    {
      favorites: [...favorites, { userId }],
    },
    { new: true }
  );

  // console.log("result", result);

  res.status(200).json({ message: "Recipe successfully added to favorites" });
});

deleteFromFavorite = catchAsync(async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user._id.toString();

  if (!mongoose.Types.ObjectId.isValid(recipeId))
    throw appError(409, `Recipe id:${recipeId} not found`);

  const { favorites } = await Recipe.findOne({ _id: recipeId });
  const isInFavorites = favorites.some(
    (favorite) => favorite.userId === userId
  );

  if (!isInFavorites)
    throw appError(409, `Recipe id:${recipeId} are not in favorites`);

  const result = await Recipe.findByIdAndUpdate(
    recipeId,
    { $pull: { favorites: { userId } } },
    { new: true }
  );


  res.status(200).json({ message: "Recipe successfully deleted from favorites" });
  // res.status(200).json({ result });
});

module.exports = {
  getFavorite,
  addToFavorite,
  deleteFromFavorite
};
