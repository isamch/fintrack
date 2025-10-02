import { Op } from "sequelize";
import { SavingGoal } from "../models/index.js";

function getProgressClasses(percent) {
  // Map percent to Tailwind width class
  if (percent >= 100) return 'w-full';
  if (percent >= 75) return 'w-3/4';
  if (percent >= 50) return 'w-1/2';
  if (percent >= 25) return 'w-1/4';
  return 'w-0';
}

export async function listGoals(req, res, next) {
  try {
    const userId = req.user.id;
    const items = await SavingGoal.findAll({ where: { userId }, order: [["dueDate", "ASC"], ["id", "DESC"]] });

    return res.render('pages/goals/index', {
      title: 'Saving Goals',
      items,
      user: req.user,
      helpers: { getProgressClasses },
    });
  } catch (err) {
    return next(err);
  }
}

export async function renderCreate(req, res, next) {
  try {
    const currencies = ["MAD", "USD", "EUR", "GBP", "SAR", "AED"]; 
    return res.render('pages/goals/form', {
      title: 'Add Goal',
      mode: 'create',
      item: null,
      currencies,
      user: req.user,
    });
  } catch (err) {
    return next(err);
  }
}

export async function createGoal(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, targetAmount, currentAmount, currency, dueDate, description } = req.body;

    await SavingGoal.create({
      userId,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      currency: currency || 'MAD',
      dueDate: dueDate || null,
      description: description || null,
    });

    return res.redirect('/goals');
  } catch (err) {
    return next(err);
  }
}

export async function renderEdit(req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const item = await SavingGoal.findOne({ where: { id, userId } });
    if (!item) return res.redirect('/goals');
    const currencies = ["MAD", "USD", "EUR", "GBP", "SAR", "AED"]; 
    return res.render('pages/goals/form', {
      title: 'Edit Goal',
      mode: 'edit',
      item,
      currencies,
      user: req.user,
    });
  } catch (err) {
    return next(err);
  }
}

export async function updateGoal(req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const { name, targetAmount, currentAmount, currency, dueDate, description } = req.body;

    const goal = await SavingGoal.findOne({ where: { id, userId } });
    if (!goal) return res.redirect('/goals');

    await goal.update({
      name,
      targetAmount,
      currentAmount,
      currency: currency || goal.currency,
      dueDate: dueDate || null,
      description: description || null,
    });

    return res.redirect('/goals');
  } catch (err) {
    return next(err);
  }
}

export async function deleteGoal(req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    await SavingGoal.destroy({ where: { id, userId } });
    return res.redirect('/goals');
  } catch (err) {
    return next(err);
  }
} 