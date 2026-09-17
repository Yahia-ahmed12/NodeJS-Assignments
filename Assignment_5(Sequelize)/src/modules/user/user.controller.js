import { Router } from "express";
import { successResponse } from "../../common/utils/success.respose.js";
import {
  getUserByEmail,
  getUserById,
  signup,
  upsertUser,
} from "./user.service.js";
const router = Router();

router.post("/signup", async (req, res, next) => {
  try {
    const data = await signup(req.body);
    return successResponse({
      res,
      status: 201,
      message: "User added successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.put("/:id", async (req, res, next) => {
  try {
    const data = await upsertUser({ id: req.params.id, ...req.body });
    return successResponse({
      res,
      status: 200,
      message: "User created or updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/by-email", async (req, res, next) => {
  try {
    const { email } = req.query;
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        message: "no user found",
      });
    }

    return successResponse({
      res,
      status: 200,
      message: "User found successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }

    return successResponse({
      res,
      status: 200,
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
