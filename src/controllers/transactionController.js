import { Op } from "sequelize";
import { Transaction } from "../models/index.js";
import { Category } from "../models/index.js";
import { getPagination } from "../utils/pagination.js";

export async function listTransactions(req, res, next) {
  try {
    const userId = req.user.id;
    const { page, limit, skip } = getPagination(req.query, 10);

    const where = { userId };

    if (req.query.type && ["income", "expense"].includes(req.query.type)) {
      where.type = req.query.type;
    }
    if (req.query.categoryId) {
      where.categoryId = req.query.categoryId || null;
    }
    if (req.query.from || req.query.to) {
      where.occurredAt = {};
      if (req.query.from) where.occurredAt[Op.gte] = new Date(req.query.from);
      if (req.query.to) where.occurredAt[Op.lte] = new Date(req.query.to);
    }

    const [categories, { rows, count }] = await Promise.all([
      Category.findAll({ where: { userId }, order: [["name", "ASC"]] }),
      Transaction.findAndCountAll({
        where,
        order: [["occurredAt", "DESC"], ["id", "DESC"]],
        offset: skip,
        limit,
      }),
    ]);

    const totalPages = Math.ceil(count / limit) || 1;

    return res.render("pages/transactions/index", {
      title: "Transactions",
      items: rows,
      categories,
      filters: {
        type: req.query.type || "",
        categoryId: req.query.categoryId || "",
        from: req.query.from || "",
        to: req.query.to || "",
      },
      pagination: { page, limit, total: count, totalPages },
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
    return res.render("pages/transactions/form", {
      title: "Add Transaction",
      mode: "create",
      item: null,
      categories,
      user: req.user,
    });
  } catch (err) {
    return next(err);
  }
}

export async function createTransaction(req, res, next) {
  try {
    const userId = req.user.id;
    const { type, amount, currency, description, occurredAt, categoryId } = req.body;

    await Transaction.create({
      userId,
      type,
      amount,
      currency: currency || undefined,
      description: description || null,
      occurredAt,
      categoryId: categoryId || null,
    });

    return res.redirect("/transactions");
  } catch (err) {
    return next(err);
  }
}

export async function renderEdit(req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const [item, categories] = await Promise.all([
      Transaction.findOne({ where: { id, userId } }),
      Category.findAll({ where: { userId }, order: [["name", "ASC"]] }),
    ]);
    if (!item) {
      return res.redirect("/transactions");
    }
    return res.render("pages/transactions/form", {
      title: "Edit Transaction",
      mode: "edit",
      item,
      categories,
      user: req.user,
    });
  } catch (err) {
    return next(err);
  }
}

export async function updateTransaction(req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const { type, amount, currency, description, occurredAt, categoryId } = req.body;

    const item = await Transaction.findOne({ where: { id, userId } });
    if (!item) {
      return res.redirect("/transactions");
    }

    await item.update({
      type,
      amount,
      currency: currency || item.currency,
      description: description || null,
      occurredAt,
      categoryId: categoryId || null,
    });

    return res.redirect("/transactions");
  } catch (err) {
    return next(err);
  }
}

export async function deleteTransaction(req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    await Transaction.destroy({ where: { id, userId } });
    return res.redirect("/transactions");
  } catch (err) {
    return next(err);
  }
} 