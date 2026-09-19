import { Router } from "express";
import { successResponse } from "../../common/utils/success.respose.js";
import { createCappedLogCollection, insertLog } from "./log.service.js";

const router = Router();

router.post("/capped", async (req, res, next) => {
  try {
    const data = await createCappedLogCollection();
    successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const data = await insertLog(req.body);
    successResponse({
      res,
      status: 201,
      message: "Log inserted successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
