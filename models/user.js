import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  profile: {
    type: Object,
    required: true,
  },
  friends: {
    type: Array,
  },
  cover: {
    type: Object,
  },
  city: {
    type: String,
  },
  status: {
    type: String,
    enum: ["single", "marred"],
  },
  bio: {
    type: String,
  },
  phone: {
    type: Number,
  },
  portfolio: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  github: {
    type: String,
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
