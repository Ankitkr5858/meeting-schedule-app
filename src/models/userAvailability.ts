import { DataTypes } from "sequelize";
import UserAvailabilityModel from "../../models/userAvailability";
import sequelize from "@/db/init";

const UserAvailability = UserAvailabilityModel(sequelize, DataTypes);
export { UserAvailability };
