import express from "express";
import {
  profile,
  getEditUser,
  postEditUser,
  getEditPassword,
  postEditPassword,
} from "../controller/userController";

const userRouter = express.Router();

userRouter.get("/", profile);
userRouter.route("/edit-user").get(getEditUser).post(postEditUser);
userRouter.route("/edit-password").get(getEditPassword).post(postEditPassword);

export default userRouter;
