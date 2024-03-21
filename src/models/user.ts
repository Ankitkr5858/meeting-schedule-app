import { DataTypes } from "sequelize";
import UsersModel from "../../models/user";
import sequelize from "@/db/init";

const Users = UsersModel(sequelize, DataTypes);
export { Users };

