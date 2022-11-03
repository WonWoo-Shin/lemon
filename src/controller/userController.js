import User from "../models/user";

export const home = (req, res) => res.render("home", { pageTitle: "홈" });

export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "회원가입" });

export const postJoin = async (req, res) => {
  const pageTitle = "회원가입";
  const { name, email, id, password, password2 } = req.body;
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
  }
  const userExist = await User.exists({ $or: [{ email }, { id }] });
  if (userExist) {
    return res.render("join", {
      pageTitle,
      errorMessage: "아이디 혹은 이메일이 이미 존재합니다.",
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
      .render("join", { pageTitle, errorMessage: error._message });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "로그인" });

export const postLogin = (req, res) => {
  const { id, password } = req.body;
  return res.redirect("/");
};
