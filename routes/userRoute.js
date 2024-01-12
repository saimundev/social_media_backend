import express from "express";
import {
  changePassword,
  VerifyOTP,
  signIn,
  singUp,
  reSendOTP,
  forgotPasswordEmailVerify,
  addFriend,
  getFriends,
  getUser,
  getUsers,
  updateUser,
  updateProfilePhoto,
  updateCoverPhoto,
} from "../controllers/userController.js";
import multer from "multer";
import auth from "../middleware/auth.js";

const router = express.Router();
const storage = multer.diskStorage({});
const upload = multer({
  storage: storage,
});

router.post("/sign-up", upload.single("profile"), singUp);
router.post("/resend-otp", reSendOTP);
router.post("/verify-otp", VerifyOTP);
router.post("/sign-in", signIn);
router.post("/forgotPassword-emailVerify", forgotPasswordEmailVerify);
router.post("/change-password", changePassword);
router.put("/add-friend", addFriend);
router.get("/get-friends/:userId", getFriends);
router.get("/get-user/:userId", getUser);
router.get("/get-users", getUsers);
router.put("/update-user/:userId", updateUser);
router.put(
  "/update-profile-photo/:userId",
  upload.single("profile"),
  updateProfilePhoto
);
router.put(
  "/update-cover-photo/:userId",
  upload.single("cover"),
  updateCoverPhoto
);

export default router;
