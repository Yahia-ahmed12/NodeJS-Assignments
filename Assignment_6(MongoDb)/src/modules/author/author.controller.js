import { Router } from "express";
import { successResponse } from "../../common/utils/success.respose.js";
import { createAuthor } from "./author.service.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const data = await createAuthor(req.body);
    successResponse({ res, data, status: 201 });
  } catch (error) {
    next(error);
  }
});
export default router;
