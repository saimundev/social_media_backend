import messageModel from "../models/message.js";

export const createMessage = async (req, res) => {
  console.log(req.body);
  try {
    await messageModel.create(req.body);
    res.status(200).json({ message: "Message create successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const message = await messageModel.find({ chatId: req.params.chatId });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
