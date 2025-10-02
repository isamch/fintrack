import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Transaction = sequelize.define("Transaction", {
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
  type: {
    type: DataTypes.ENUM("income", "expense"),
    allowNull: false,
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
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  occurredAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "transactions",
  modelName: "Transaction",
  timestamps: true,
  indexes: [
    { fields: ["userId", "occurredAt"] },
    { fields: ["userId", "type"] },
    { fields: ["categoryId"] },
  ],
});

export default Transaction; 