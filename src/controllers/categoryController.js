import { Category } from "../models/index.js";

export async function listCategories(req, res, next) {
  try {
    const userId = req.user.id;
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
    const { name, type, color, icon } = req.body;
    await Category.create({ userId, name, type, color: color || null, icon: icon || null, isDefault: false });
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
    const { name, type, color, icon } = req.body;
    const item = await Category.findOne({ where: { id, userId } });
    if (!item) return res.redirect('/categories');
    await item.update({ name, type, color: color || null, icon: icon || null });
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