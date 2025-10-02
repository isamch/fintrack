import User from "./User.js";
import Preference from "./Preference.js";
import Category from "./Category.js";
import Transaction from "./Transaction.js";
import Budget from "./Budget.js";
import SavingGoal from "./SavingGoal.js";

// Define associations in a single place to avoid circular imports

// User ↔ Preference (1:1)
User.hasOne(Preference, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Preference.belongsTo(User, { foreignKey: "userId" });

// User ↔ Category (1:N)
User.hasMany(Category, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Category.belongsTo(User, { foreignKey: "userId" });

// User ↔ Transaction (1:N)
User.hasMany(Transaction, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Transaction.belongsTo(User, { foreignKey: "userId" });

// Category ↔ Transaction (1:N)
Category.hasMany(Transaction, { foreignKey: "categoryId", onDelete: "SET NULL", onUpdate: "CASCADE" });
Transaction.belongsTo(Category, { foreignKey: "categoryId" });

// User ↔ Budget (1:N)
User.hasMany(Budget, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Budget.belongsTo(User, { foreignKey: "userId" });

// Category ↔ Budget (1:N) (optional)
Category.hasMany(Budget, { foreignKey: "categoryId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Budget.belongsTo(Category, { foreignKey: "categoryId" });

// User ↔ SavingGoal (1:N)
User.hasMany(SavingGoal, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });
SavingGoal.belongsTo(User, { foreignKey: "userId" });

export {
  User,
  Preference,
  Category,
  Transaction,
  Budget,
  SavingGoal,
}; 