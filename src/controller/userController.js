import User from "../models/user";
import bcrypt from "bcrypt";

export const home = (req, res) => res.render("home", { pageTitle: "홈" });

export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "계정 만들기" });

export const postJoin = async (req, res) => {
  const pageTitle = "계정 만들기";
  const RENDER_JOIN = "join";
  const { name, email, id, password, password2 } = req.body;
  if (password !== password2) {
    return res.status(400).render(RENDER_JOIN, {
      pageTitle,
      errorMessage: "비밀번호가 서로 일치하지 않습니다.",
    });
  }
  const emailExist = await User.exists({ email });
  if (emailExist) {
    return res.status(400).render(RENDER_JOIN, {
      pageTitle,
      errorMessage: "이미 존재하는 이메일입니다.",
    });
  }
  const idExist = await User.exists({ id });
  if (idExist) {
    return res.status(400).render(RENDER_JOIN, {
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
    return res.redirect("/login");
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
  const RENDER_LOGIN = "login";
  const { id, password } = req.body;
  const user = await User.findOne({ id });
  if (!user) {
    return res.status(400).render(RENDER_LOGIN, {
      pageTitle,
      errorMessage: "존재하지 않는 아이디입니다.",
    });
  }
  const pwdCheck = await bcrypt.compare(password, user.password);
  if (!pwdCheck) {
    return res.status(400).render(RENDER_LOGIN, {
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

export const getEditUser = (req, res) =>
  res.render("edit-user", { pageTitle: "내 정보 수정" });

export const postEditUser = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { name, email, id },
  } = req;
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      { name, email, id },
      { new: true }
    );
    req.session.user = updateUser;
    return res.redirect("/user");
  } catch {
    return res.render("edit-user", {
      pageTitle: "내 정보 수정",
      errorMessage: "이메일 혹은 아이디가 이미 존재합니다.",
    });
  }
};

export const getEditPassword = (req, res) =>
  res.render("edit-password", { pageTitle: "비밀번호 변경" });

export const postEditPassword = async (req, res) => {
  const pageTitle = "비밀번호 변경";
  const RENDER_EDITPWD = "edit-password";
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPassword2 },
  } = req;
  const user = await User.findById(_id);
  const pwdCheck = await bcrypt.compare(oldPassword, user.password);
  if (!pwdCheck) {
    return res.render(RENDER_EDITPWD, {
      pageTitle,
      errorMessage: "현재 비밀번호가 일치하지 않습니다.",
    });
  }
  if (oldPassword === newPassword) {
    return res.render(RENDER_EDITPWD, {
      pageTitle,
      errorMessage: "현재 비밀번호와 다른 비밀번호를 입력해주세요.",
    });
  }
  if (newPassword !== newPassword2) {
    return res.render(RENDER_EDITPWD, {
      pageTitle,
      errorMessage: "새 비밀번호가 서로 일치하지 않습니다.",
    });
  }
  user.password = newPassword;
  await user.save();
  return res.redirect("/user");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
