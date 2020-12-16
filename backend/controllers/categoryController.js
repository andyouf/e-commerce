import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json({categories});
})

export {
  getCategories,
  // getCategoryById,
  // deleteCategory,
  // createCategory,
  // updateCategory
}