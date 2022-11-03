import express from "express";
import {
  home,
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  profile,
} from "../controller/userController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/profile", profile);

export default rootRouter;
