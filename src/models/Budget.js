import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Budget = sequelize.define("Budget", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
  },
  period: {
    type: DataTypes.ENUM("monthly", "weekly", "yearly"),
    allowNull: false,
    defaultValue: "monthly",
  },
  month: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: true,
  },
  year: {
    type: DataTypes.SMALLINT.UNSIGNED,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: "MAD",
  },
}, {
  tableName: "budgets",
  modelName: "Budget",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["userId", "period", "year", "month", "categoryId"] },
    { fields: ["userId"] },
  ],
});

export default Budget; 