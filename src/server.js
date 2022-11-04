import express from "express";
import "./db";
import session from "express-session";
import mongoose from "mongoose";
import { middleware } from "./middleware";
import rootRouter from "./router/rootRouter";
import userRouter from "./router/userRouter";
import MongoStore from "connect-mongo";

const app = express();

app.set("view engine", "pug"); // 확장자 지정
app.set("views", process.cwd() + "/src/views"); // 폴더 경로 지정
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "Hello",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ client: mongoose.connection.client }),
  })
);
app.use(middleware);
app.use("/", rootRouter);
app.use("/user", userRouter);

app.listen(4000, () => console.log("Server Connnected✅"));
