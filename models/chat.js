import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  members: Array,
});

const ChatModel = mongoose.model("Chat", chatSchema);

export default ChatModel;
