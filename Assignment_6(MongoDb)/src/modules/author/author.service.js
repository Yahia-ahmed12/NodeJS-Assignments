import { getAuthorModel } from "../../DB/model/author.model.js";

export const createAuthor = async ({ name, nationality }) => {
  const data = await getAuthorModel().insertOne({ name, nationality });
  return data;
};
