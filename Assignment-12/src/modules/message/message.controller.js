import { Router } from "express";
import { successResponse } from "../../common/utils/success.respose.js";
const router = Router();
router.get("/", async (req, res, next) => {
  try {
    return successResponse({
      res,
      status: 201,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
