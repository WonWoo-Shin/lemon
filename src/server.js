import express from "express";
import "./db";
import rootRouter from "./router/rootRouter";

const app = express();

app.set("view engine", "pug"); // 확장자 지정
app.set("views", process.cwd() + "/src/views"); // 폴더 경로 지정
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.siteName = "Lemon";
  next();
});
app.use("/", rootRouter);

app.listen(4000, () => console.log("Server Connnected✅"));
