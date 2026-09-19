import { getDB } from "../conection.db.js";

export const getAuthorModel = () => {
  return getDB().collection("authors");
};
