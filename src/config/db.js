import { Sequelize } from "sequelize";


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

const connectDB = async () => {

  try {

    await sequelize.authenticate();
    
    console.log(
      `MySQL Connected: ${sequelize.getDialect()}@${process.env.DB_HOST}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME}`
    );

    const shouldAlter = process.env.NODE_ENV !== "production";
    await sequelize.sync({ alter: shouldAlter });
    console.log("Sequelize models synchronized");

  } catch (error) {
    console.log("error db conection : " + error.message);
    process.exit(1);
  }

};


export { sequelize };
export default connectDB;