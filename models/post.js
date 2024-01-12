import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    postText: {
      type: String,
    },
    postImage: {
      type: Object,
    },
    userId: {
      type: String,
      required: true,
    },
    likes: [
      {
        like: String,
        likeBy: { type: mongoose.Types.ObjectId, ref: "User" },
      },
    ],
    postBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        comment: String,
        createdAt: Date,
        commentBy: { type: mongoose.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;
