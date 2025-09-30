import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  emailVerifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  emailVerificationCodeHash: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  emailVerificationCodeExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "users",
  modelName: "User",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["email"] },
  ],
  defaultScope: {
    attributes: { exclude: ["password", "emailVerificationCodeHash", "emailVerificationCodeExpiresAt"] }
  },
  scopes: {
    withSensitive: { attributes: { include: ["password", "emailVerificationCodeHash", "emailVerificationCodeExpiresAt"] } },
    auth: { attributes: { include: ["password"] } }
  }
});

export default User;
