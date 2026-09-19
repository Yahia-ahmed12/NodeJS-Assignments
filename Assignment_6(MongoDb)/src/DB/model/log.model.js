import { getDB } from "../conection.db.js";
export const getLogModel = () => {
  return getDB().collection("logs");
};
