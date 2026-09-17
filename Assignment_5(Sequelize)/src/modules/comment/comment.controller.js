import { Router } from "express";
import { successResponse } from "../../common/utils/success.respose.js";
import {
  createBulkCommentsService,
  updateCommentService,
  findOrCreateCommentService,
  searchCommentsService,
  getNewestCommentsService,
  getCommentDetailsService,
} from "./comment.service.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { comments } = req.body;

    const data = await createBulkCommentsService(comments);

    return successResponse({
      res,
      status: 201,
      message: "comments created.",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:commentId", async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    await updateCommentService({ commentId, userId, content });

    return successResponse({
      res,
      status: 200,
      message: "Comment updated.",
    });
  } catch (error) {
    next(error);
  }
});
router.post("/find-or-create", async (req, res, next) => {
  try {
    const { postId, userId, content } = req.body;

    const { comment, created } = await findOrCreateCommentService({
      postId,
      userId,
      content,
    });

    return res.status(created ? 201 : 200).json({
      comment,
      created,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/search", async (req, res, next) => {
  try {
    const { word } = req.query;

    const result = await searchCommentsService(word);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/newest/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await getNewestCommentsService(postId);

    return res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});
router.get("/details/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await getCommentDetailsService(id);

    return res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
});
export default router;
