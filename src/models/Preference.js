import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Preference = sequelize.define("Preference", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    unique: true,
  },
  language: {
    type: DataTypes.ENUM("ar", "en", "fr"),
    allowNull: false,
    defaultValue: "ar",
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: "MAD",
  },
  locale: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: "ar-MA",
  },
  dateFormat: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "YYYY-MM-DD",
  },
  numberFormat: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "1,234.56",
  },
}, {
  tableName: "preferences",
  modelName: "Preference",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["userId"] },
  ],
});

export default Preference; 