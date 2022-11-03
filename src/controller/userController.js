import User from "../models/user";
import bcrypt from "bcrypt";

export const home = (req, res) => res.render("home", { pageTitle: "홈" });

export const getJoin = (req, res) => res.render("join", { pageTitle: "가입" });

export const postJoin = async (req, res) => {
  const pageTitle = "가입";
  const { name, email, id, password, password2 } = req.body;
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "비밀번호가 서로 일치하지 않습니다.",
    });
  }
  const emailExist = await User.exists({ email });
  if (emailExist) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "이미 존재하는 이메일입니다.",
    });
  }
  const idExist = await User.exists({ id });
  if (idExist) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "이미 존재하는 아이디입니다.",
    });
  }
  try {
    await User.create({
      name,
      email,
      id,
      password,
    });
    return res.redirect("/");
  } catch (error) {
    return res
      .status(400)
      .render("join", { pageTitle, errorMessage: error.message });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "로그인" });

export const postLogin = async (req, res) => {
  const pageTitle = "로그인";
  const { id, password } = req.body;
  const user = await User.findOne({ id });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "존재하지 않는 아이디입니다.",
    });
  }
  const pwdCheck = await bcrypt.compare(password, user.password);
  if (!pwdCheck) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const profile = (req, res) =>
  res.render("profile", { pageTitle: "내 정보" });
