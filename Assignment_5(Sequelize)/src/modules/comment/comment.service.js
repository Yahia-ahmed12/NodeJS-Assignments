import { CommentModel, UserModel, PostModel } from "../../DB/model/index.js";
import { Op } from "sequelize";

export const createBulkCommentsService = async (comments) => {
  if (!comments || !Array.isArray(comments) || comments.length === 0) {
    const error = new Error("Invalid or empty comments array");
    error.statusCode = 400;
    throw error;
  }

  const result = await CommentModel.bulkCreate(comments);
  return result;
};
export const updateCommentService = async ({ commentId, userId, content }) => {
  const comment = await CommentModel.findByPk(commentId);

  if (!comment) {
    const error = new Error("comment not found.");
    error.statusCode = 404;
    throw error;
  }

  if (comment.userId !== Number(userId)) {
    const error = new Error("You are not authorized to update this comment.");
    error.statusCode = 403;
    throw error;
  }

  comment.content = content;
  await comment.save();

  return comment;
};
export const findOrCreateCommentService = async ({
  postId,
  userId,
  content,
}) => {
  const [comment, created] = await CommentModel.findOrCreate({
    where: { postId, userId, content },
    defaults: { postId, userId, content },
  });

  return { comment, created };
};

export const searchCommentsService = async (word) => {
  const { count, rows: comments } = await CommentModel.findAndCountAll({
    where: {
      content: {
        [Op.like]: `%${word}%`,
      },
    },
  });

  if (count === 0) {
    const error = new Error("no comments found.");
    error.statusCode = 404;
    throw error;
  }

  return { count, comments };
};
export const getNewestCommentsService = async (postId) => {
  const comments = await CommentModel.findAll({
    where: { postId },
    attributes: ["id", "content", "createdAt"],
    order: [["createdAt", "DESC"]],
    limit: 3,
  });

  return comments;
};
export const getCommentDetailsService = async (id) => {
  const comment = await CommentModel.findByPk(id, {
    attributes: ["id", "content"],
    include: [
      {
        model: UserModel,
        attributes: ["id", "name", "email"],
      },
      {
        model: PostModel,
        attributes: ["id", "title", "content"],
      },
    ],
  });

  if (!comment) {
    const error = new Error("no comment found");
    error.statusCode = 404;
    throw error;
  }

  return comment;
};
