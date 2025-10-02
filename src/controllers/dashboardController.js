import { Op } from "sequelize";
import { Transaction, Budget, SavingGoal, Category } from "../models/index.js";

function getMonthRange(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const start = new Date(year, month, 1, 0, 0, 0, 0);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return { start, end, year, month: month + 1 };
}

export async function dashboard(req, res, next) {
  try {
    const userId = req.user.id;
    const { start, end, year, month } = getMonthRange();

    // Income and expenses (current month)
    const [incomeSum, expenseSum] = await Promise.all([
      Transaction.sum('amount', { where: { userId, type: 'income', occurredAt: { [Op.between]: [start, end] } } }),
      Transaction.sum('amount', { where: { userId, type: 'expense', occurredAt: { [Op.between]: [start, end] } } }),
    ]);

    const totalIncome = Number(incomeSum || 0);
    const totalExpenses = Number(expenseSum || 0);

    // Budgets (current month): total budget and spent
    const budgets = await Budget.findAll({ where: { userId, period: 'monthly', year, month } });
    let totalBudget = 0;
    let totalBudgetSpent = 0;
    for (const b of budgets) {
      totalBudget += Number(b.amount);
      const where = { userId, type: 'expense', occurredAt: { [Op.between]: [start, end] } };
      if (b.categoryId) where.categoryId = b.categoryId;
      const spent = await Transaction.sum('amount', { where });
      totalBudgetSpent += Number(spent || 0);
    }
    const budgetPct = totalBudget > 0 ? Math.min(100, Math.round((totalBudgetSpent / totalBudget) * 100)) : 0;

    // Goals progress
    const goals = await SavingGoal.findAll({ where: { userId } });
    const sumTarget = goals.reduce((acc, g) => acc + Number(g.targetAmount || 0), 0);
    const sumCurrent = goals.reduce((acc, g) => acc + Number(g.currentAmount || 0), 0);
    const goalsPct = sumTarget > 0 ? Math.min(100, Math.round((sumCurrent / sumTarget) * 100)) : 0;

    // Approaching due goals (within 7 days)
    const now = new Date();
    const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const approachingDue = await SavingGoal.count({ where: { userId, dueDate: { [Op.between]: [now, in7] } } });

    // Helper to map percent to width class (avoid inline style)
    const widthClass = (pct) => pct >= 100 ? 'w-full' : pct >= 75 ? 'w-3/4' : pct >= 50 ? 'w-1/2' : pct >= 25 ? 'w-1/4' : pct > 0 ? 'w-1/6' : 'w-0';

    return res.render('pages/dashboard', {
      title: 'Dashboard',
      month,
      year,
      totalIncome,
      totalExpenses,
      totalBudget,
      totalBudgetSpent,
      budgetPct,
      goalsPct,
      sumTarget,
      sumCurrent,
      approachingDue,
      widthClass,
      user: req.user,
    });
  } catch (err) {
    return next(err);
  }
} 