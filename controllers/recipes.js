const { mongoose } = require("mongoose");

const { catchAsync, appError } = require("../helpers");
const { Recipe } = require("../models/recipeModel");
const ObjectId = require("mongodb").ObjectId;

getCategoriesPreview  = catchAsync(async (req, res) => {
  const result = await Recipe.aggregate([
    { $match: { category: {$in: ['Breakfast', 'Miscellaneous', 'Chicken', 'Dessert']} } },
    { $group: { _id: "$category", recipes: { $push: "$$ROOT" } } },
    { $project: { recipes: { $slice: ["$recipes", 4] } } },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({result});
});

getCategoriesList = catchAsync(async (req, res) => {
  const result = await Recipe.aggregate([
    { $match: { category: { $exists: true }} },
    { $group: { _id: "$category"}},
    { $sort: { _id: 1 } },
  ]);

  const categories = result.map(item => item._id);

  res.status(200).json({categories});
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

// getRecipeById  = catchAsync(async (req, res) => {
//   const { recipeId } = req.params;
//   const result = await Recipe.aggregate([
//     {
//       $match: {
//         _id: new ObjectId(recipeId),
//       },
//     },
//     {
//       $lookup: {
//         from: "ingredients",
//         localField: "ingredients.id",
//         foreignField: "_id",
//         as: "ingredientsData",
//       },
//     },
//     {
//       $set: {
//         ingredients: {
//           $map: {
//             input: "$ingredients",
//             in: {
//               $mergeObjects: [
//                 "$$this",
//                 {
//                   $arrayElemAt: [
//                     "$ingredientsData",
//                     {
//                       $indexOfArray: ["$ingredientsData._id", "$$this.id"],
//                     },
//                   ],
//                 },
//               ],
//             },
//           },
//         },
//       },
//     },
//     {
//       $unset: ["ingredientsData", "ingredients.id"],
//     },
//   ]);

//   res.status(200).json({result});
// });

getRecipeById  = catchAsync(async (req, res) => {
  const { recipeId } = req.params;
  const result = await Recipe.aggregate([
    {
      $match: { _id: new ObjectId(recipeId)},
    },
    {
      $lookup: {
        from: "ingredients",
        localField: "ingredients.id",
        foreignField: "_id",
        as: "ingredientsData",
      },
    },
    {
      $set: {
        ingredients: {
          $map: {
            input: "$ingredients",
            in: {
              $mergeObjects: [
                "$$this",
                {
                  $arrayElemAt: [
                    "$ingredientsData",
                    {
                      $indexOfArray: ["$ingredientsData._id", "$$this.id"],
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    },
    {
      $unset: ["ingredientsData", "ingredients.id", "favorites"],
    },
  ]);

  res.status(200).json(result[0]);
});

getRecipesBySearchTitle  = catchAsync(async (req, res) => {
  let { title, page = 1, limit = 12 } = req.query;
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  if (title === undefined) {
    throw new appError("Recipe title query must be passed");
  }
  // if (title?.trim() === "") return [];

  const result =  await Recipe.aggregate([
    {
      $match: { title: { $regex: new RegExp(title, "i") }},
    },
    { $setWindowFields: { output: { totalCount: { $count: {} } } } },
    // { $skip: skip },
    // { $limit: limit },
  ]);



  res.status(200).json({result});
});

// ===== favorites =====
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
    {
      $unset: ["favorites"],
    },
  ]);

  res.status(200).json( userFavoriteRecipes );
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

  await Recipe.findByIdAndUpdate(
    recipeId,
    {
      favorites: [...favorites, { userId }],
    },
    { new: true }
  );

  // await User.findByIdAndUpdate(
  //   userId,
  //   {
  //     favorites: [...favorites, { recipeId }],
  //   },
  //   { new: true }
  // );


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
  getCategoriesPreview,
  getCategoriesList,
  getRecipesByCategory,
  getRecipeById,
  getRecipesBySearchTitle,
  getFavorite,
  addToFavorite,
  deleteFromFavorite
};
