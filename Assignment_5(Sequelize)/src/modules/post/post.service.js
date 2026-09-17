import { PostModel, UserModel, CommentModel } from "../../DB/model/index.js";
import { fn, col } from "sequelize";
export const createPost = async (postData) => {
  const post = PostModel.build(postData);
  await post.save();
  return post;
};
export const deletePostService = async (postId, userId) => {
  const post = await PostModel.findByPk(postId);

  if (!post) {
    return { status: 404, message: "Post not found." };
  }

  if (post.userId !== Number(userId)) {
    return {
      status: 403,
      message: "You are not authorized to delete this post.",
    };
  }

  await post.destroy();
  return { status: 200, message: "Post deleted." };
};

export const getPostsDetailsService = async () => {
  const posts = await PostModel.findAll({
    attributes: ["id", "title"],
    include: [
      {
        model: UserModel,
        attributes: ["name"],
      },
      {
        model: CommentModel,
        attributes: ["id", "content"],
      },
    ],
  });

  return posts;
};

export const getPostCommentCountService = async () => {
  const posts = await PostModel.findAll({
    attributes: [
      "id",
      "title",
      [fn("COUNT", col("Comments.id")), "commentCount"],
    ],
    include: [
      {
        model: CommentModel,
        attributes: [],
      },
    ],
    group: ["Post.id"],
  });

  return posts;
};
