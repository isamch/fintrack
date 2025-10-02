import { Op, fn, col, literal } from "sequelize";
import { Budget, Category, Transaction } from "../models/index.js";

function getMonthRange(year, month) {
  const start = new Date(Number(year), Number(month) - 1, 1, 0, 0, 0, 0);
  const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999); // last day of month
  return { start, end };
}

export async function listBudgets(req, res, next) {
  try {
    const userId = req.user.id;

    const budgets = await Budget.findAll({
      where: { userId },
      order: [["year", "DESC"], ["month", "DESC"], ["id", "DESC"]],
    });

    const categories = await Category.findAll({ where: { userId }, order: [["name", "ASC"]] });

    // Compute spending per budget (sum of expense transactions within month/year, category match if provided)
    const spendingMap = {};
    for (const b of budgets) {
      const { start, end } = getMonthRange(b.year, b.month);
      const where = {
        userId,
        type: 'expense',
        occurredAt: { [Op.between]: [start, end] },
      };
      if (b.categoryId) {
        where.categoryId = b.categoryId;
      }
      const sum = await Transaction.sum('amount', { where });
      spendingMap[b.id] = Number(sum || 0);
    }

    return res.render("pages/budgets/index", {
      title: "Budgets",
      items: budgets,
      categories,
      spendingMap,
      user: req.user,
    });
  } catch (err) {
    return next(err);
  }
}

export async function renderCreate(req, res, next) {
  try {
    const userId = req.user.id;
    const categories = await Category.findAll({ where: { userId }, order: [["name", "ASC"]] });
    const currencies = ["MAD", "USD", "EUR", "GBP", "SAR", "AED"]; 
    const now = new Date();
    return res.render("pages/budgets/form", {
      title: "Add Budget",
      mode: "create",
      item: null,
      categories,
      currencies,
      defaults: { year: now.getFullYear(), month: now.getMonth() + 1 },
      user: req.user,
    });
  } catch (err) {
    return next(err);
  }
}

export async function createBudget(req, res, next) {
  try {
    const userId = req.user.id;
    const { categoryId, month, year, amount, currency } = req.body;

    await Budget.create({
      userId,
      categoryId: categoryId || null,
      period: 'monthly',
      month,
      year,
      amount,
      currency: currency || 'MAD',
    });

    return res.redirect('/budgets');
  } catch (err) {
    return next(err);
  }
}

export async function renderEdit(req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const [item, categories] = await Promise.all([
      Budget.findOne({ where: { id, userId } }),
      Category.findAll({ where: { userId }, order: [["name", "ASC"]] }),
    ]);
    if (!item) return res.redirect('/budgets');
    const currencies = ["MAD", "USD", "EUR", "GBP", "SAR", "AED"]; 
    return res.render('pages/budgets/form', {
      title: 'Edit Budget',
      mode: 'edit',
      item,
      categories,
      currencies,
      defaults: null,
      user: req.user,
    });
  } catch (err) {
    return next(err);
  }
}

export async function updateBudget(req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const { categoryId, month, year, amount, currency } = req.body;

    const budget = await Budget.findOne({ where: { id, userId } });
    if (!budget) return res.redirect('/budgets');

    await budget.update({
      categoryId: categoryId || null,
      month,
      year,
      amount,
      currency: currency || budget.currency,
    });

    return res.redirect('/budgets');
  } catch (err) {
    return next(err);
  }
}

export async function deleteBudget(req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    await Budget.destroy({ where: { id, userId } });
    return res.redirect('/budgets');
  } catch (err) {
    return next(err);
  }
} 