import { getDB } from "../../DB/conection.db.js";
import { getLogModel } from "../../DB/model/log.model.js";
export const createCappedLogCollection = async () => {
  await getDB().createCollection("logs", {
    capped: true,
    size: 1048576,
  });

  return { ok: 1 };
};

export const insertLog = async (logData) => {
  const data = await getLogModel().insertOne(logData);
  return data;
};
