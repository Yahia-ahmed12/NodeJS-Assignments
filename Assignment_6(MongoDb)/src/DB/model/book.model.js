import { getDB } from "../conection.db.js";

export const getBookModel = () => {
  return getDB().collection("books");
};
