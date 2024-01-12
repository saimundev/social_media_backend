import ChatModel from "../models/chat.js";

export const createChat = async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [userId, friendId] },
    });

    if (chat) return res.status(200).json(chat);
    await ChatModel.create({
      members: [userId, friendId],
    });
    res.status(200).json({ message: "Message create successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChatByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const chat = await ChatModel.find({
      members: { $in: [userId] },
    });

    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChats = async (req, res) => {
  const { userId } = req.params;
  try {
    const chat = await ChatModel.find({
      members: { $in: [userId] },
    });

    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
