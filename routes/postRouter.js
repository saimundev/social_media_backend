import express from "express";
import multer from "multer";
import {
  commentPost,
  createPost,
  deletePost,
  getPostById,
  getPostByUser,
  getTimeLinePost,
  getVideoData,
  likePost,
  updatePost,
} from "../controllers/PostModel.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({});

const upload = multer({
  storage: storage,
});

router.post("/create-post", auth, upload.single("postImage"), createPost);
router.get("/get-posts/:userId", auth, getPostByUser);
router.get("/get-post/:postId", auth, getPostById);
router.put(
  "/update-post/:postId",
  auth,
  upload.single("postImage"),
  updatePost
);
router.delete("/delete-post/:postId", auth, deletePost);
router.put("/like-post", auth, likePost);
router.put("/comment-post", auth, commentPost);
router.get("/get-timeLinePost/:userId", auth, getTimeLinePost);
router.get("/get-video", auth, getVideoData);

export default router;
