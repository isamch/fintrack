import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Category = sequelize.define("Category", {
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
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("income", "expense"),
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: "categories",
  modelName: "Category",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["userId", "name", "type"] },
    { fields: ["userId"] },
  ],
});

export default Category; 