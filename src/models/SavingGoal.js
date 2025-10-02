import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const SavingGoal = sequelize.define("SavingGoal", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  targetAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  currentAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: "MAD",
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: "saving_goals",
  modelName: "SavingGoal",
  timestamps: true,
  indexes: [
    { fields: ["userId"] },
  ],
});

export default SavingGoal; 