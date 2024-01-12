import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRouter.js";
import chatRouter from "./routes/chatRouter.js";
import messageRouter from "./routes/messageRouter.js";
import dbConnect from "./models/db.js";

//init app
const app = express();

//env confige
dotenv.config();

//DB connect
dbConnect();

//port
const port = process.env.PORT || 5050;

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

//server
app.listen(port, () => {
  console.log("server is raning oh the port is 5050");
});
