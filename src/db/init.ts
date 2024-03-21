import { Sequelize } from "sequelize";
const sequelize = new Sequelize(
  "postgres://postgres:123456@127.0.0.1:5432/meetings_db",
); // Example for postgrestr
sequelize.authenticate();
export default sequelize
