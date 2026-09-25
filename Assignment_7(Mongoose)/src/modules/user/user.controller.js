import { Router } from "express";
import { successResponse } from "../../common/utils/success.respose.js";
import {
  deleteUser,
  getUserById,
  login,
  signup,
  updateUser,
} from "./user.service.js";
const router = Router();

router.post("/signup", async (req, res, next) => {
  try {
    const result = await signup(req.body);
    if (result.status === 409) {
      return res.status(409).json({ message: result.message });
    }
    return successResponse({
      res,
      status: 201,
      message: "User added successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await login(req.body);
    if (result.status === 400) {
      return res.status(400).json({ message: result.message });
    }
    return successResponse({ res, message: "Login successful", data: result });
  } catch (error) {
    next(error);
  }
});
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await updateUser(id, req.body);

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    return successResponse({
      res,
      status: 200,
      message: "User updated",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});
router.delete("/", async (req, res, next) => {
  try {
    const { id } = req.query;

    const result = await deleteUser(id);

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    return successResponse({
      res,
      status: 200,
      message: "User deleted",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/", async (req, res, next) => {
  try {
    const { id } = req.query;

    const result = await getUserById(id);

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    return successResponse({
      res,
      status: 200,
      message: "Done",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
