import { Category } from "../models/index.js";

// Helper function to create default categories for new users
async function createDefaultCategories(userId) {
  const defaultCategories = [
    // Income categories
    { name: 'Salary', type: 'income', isDefault: true },
    { name: 'Freelance', type: 'income', isDefault: true },
    { name: 'Investment', type: 'income', isDefault: true },
    { name: 'Business', type: 'income', isDefault: true },
    { name: 'Gift', type: 'income', isDefault: true },
    
    // Expense categories
    { name: 'Food & Dining', type: 'expense', isDefault: true },
    { name: 'Transportation', type: 'expense', isDefault: true },
    { name: 'Shopping', type: 'expense', isDefault: true },
    { name: 'Entertainment', type: 'expense', isDefault: true },
    { name: 'Bills & Utilities', type: 'expense', isDefault: true },
    { name: 'Healthcare', type: 'expense', isDefault: true },
    { name: 'Education', type: 'expense', isDefault: true },
    { name: 'Housing', type: 'expense', isDefault: true },
  ];

  for (const categoryData of defaultCategories) {
    await Category.create({ ...categoryData, userId });
  }
}

export async function listCategories(req, res, next) {
  try {
    const userId = req.user.id;
    
    // Check if user has any categories, if not create default ones
    const categoryCount = await Category.count({ where: { userId } });
    if (categoryCount === 0) {
      await createDefaultCategories(userId);
    }
    
    const items = await Category.findAll({ where: { userId }, order: [["type", "ASC"], ["name", "ASC"]] });
    return res.render('pages/categories/index', { title: 'Categories', categories: items, user: req.user });
  } catch (err) {
    return next(err);
  }
}

export async function renderCreate(req, res, next) {
  try {
    return res.render('pages/categories/form', { title: 'Add Category', mode: 'create', item: null, user: req.user });
  } catch (err) {
    return next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, type } = req.body;
    await Category.create({ userId, name, type, isDefault: false });
    return res.redirect('/categories');
  } catch (err) {
    return next(err);
  }
}

export async function renderEdit(req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const item = await Category.findOne({ where: { id, userId } });
    if (!item) return res.redirect('/categories');
    return res.render('pages/categories/form', { title: 'Edit Category', mode: 'edit', item, user: req.user });
  } catch (err) {
    return next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const { name, type } = req.body;
    const item = await Category.findOne({ where: { id, userId } });
    if (!item) return res.redirect('/categories');
    await item.update({ name, type });
    return res.redirect('/categories');
  } catch (err) {
    return next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    await Category.destroy({ where: { id, userId, isDefault: false } });
    return res.redirect('/categories');
  } catch (err) {
    return next(err);
  }
} 