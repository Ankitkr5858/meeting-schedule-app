import { DataTypes } from "sequelize";
import MeetingUserRelationshipModel from "../../models/MeetingUserRelationship";
import sequelize from "@/db/init";

const UserMeeting = MeetingUserRelationshipModel(sequelize, DataTypes);
export { UserMeeting };
