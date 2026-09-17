import { Router } from "express";
import {
  createPost,
  deletePostService,
  getPostCommentCountService,
  getPostsDetailsService,
} from "./post.service.js";
import { successResponse } from "../../common/utils/success.respose.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const post = await createPost(req.body);
    return successResponse({
      res,
      status: 201,
      message: "Post created successfully.",
      data: post,
    });
  } catch (error) {
    next(error);
  }
});
router.delete("/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const result = await deletePostService(postId, userId);

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    return successResponse({
      res,
      status: 200,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/details", async (req, res, next) => {
  try {
    const posts = await getPostsDetailsService();

    return successResponse({
      res,
      status: 200,
      message: "Posts retrieved successfully",
      data: posts,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/comment-count", async (req, res, next) => {
  try {
    const posts = await getPostCommentCountService();

    return successResponse({
      res,
      status: 200,
      message: "Posts comment count retrieved successfully",
      data: posts,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
