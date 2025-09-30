import User from "../models/User.js";
import { doHash, doHashValidation, hmacHash } from "../utils/hashing.js";
import { signToken } from "../utils/jwt.js";
import { sendCookies, clearCookie } from "../utils/Cookies.js";
import { sendMail } from "../utils/email.js";
import { generateOTP } from "../utils/generateOTP.js";


export const renderRegister = (req, res) => {
  return res.render("pages/auth/register", { title: "Register", errors: null, old: {} });
};

export const renderLogin = (req, res) => {
  return res.render("pages/auth/login", { title: "Login", errors: null, old: {} });
};

export const renderVerify = (req, res) => {
  return res.render("pages/auth/verify", { title: "Verify Email", errors: null, old: {} });
};

export const postRegister = async (req, res) => {

  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).render("pages/auth/register", {
        title: "Register",
        errors: { email: "Email already registered" },
        old: { name, email }
      });
    }

    const hashed = await doHash(password);
    const user = await User.create({ name, email, password: hashed });

    const token = signToken({ id: user.id, name: user.name, email: user.email }, "7d");

    sendCookies(res, {
      name: "Authorization",
      value: `Bearer ${token}`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    });

    return res.redirect("/");

  } catch (error) {
    return res.status(500).render("pages/auth/register", {
      title: "Register",
      errors: { general: error.message || "Something went wrong" },
      old: req.body || {}
    });
  }
};

export const postLogin = async (req, res) => {

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).render("pages/auth/login", {
        title: "Login",
        errors: { general: "Invalid credentials" },
        old: { email }
      });
    }

    const valid = await doHashValidation(password, user.password);
    if (!valid) {
      return res.status(401).render("pages/auth/login", {
        title: "Login",
        errors: { general: "Invalid credentials" },
        old: { email }
      });
    }

    const token = signToken({ id: user.id, name: user.name, email: user.email }, "7d");

    sendCookies(res, {
      name: "Authorization",
      value: `Bearer ${token}`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    });

    return res.redirect("/");

  } catch (error) {
    return res.status(500).render("pages/auth/login", {
      title: "Login",
      errors: { general: error.message || "Something went wrong" },
      old: req.body || {}
    });
  }
};

export const postLogout = async (req, res) => {
  clearCookie(res, "Authorization");
  return res.redirect("/login");
};

export const postSendVerificationCode = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).render("pages/auth/verify", {
        title: "Verify Email",
        errors: { general: "User not found" },
        old: {}
      });
    }

    const code = generateOTP(6);
    user.emailVerificationCodeHash = hmacHash(code);
    user.emailVerificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendMail({
      to: user.email,
      subject: "Verify your email",
      templateName: "verification",
      templateData: { name: user.name, code },
    });

    return res.render("pages/auth/verify", {
      title: "Verify Email",
      errors: null,
      old: { info: "A verification code has been sent to your email" }
    });

  } catch (error) {
    return res.status(500).render("pages/auth/verify", {
      title: "Verify Email",
      errors: { general: error.message || "Something went wrong" },
      old: {}
    });
  }
};

export const postVerifyEmail = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { code } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).render("pages/auth/verify", {
        title: "Verify Email",
        errors: { general: "User not found" },
        old: {}
      });
    }

    if (!user.emailVerificationCodeHash || !user.emailVerificationCodeExpiresAt) {
      return res.status(400).render("pages/auth/verify", {
        title: "Verify Email",
        errors: { general: "No verification in progress" },
        old: {}
      });
    }

    if (new Date() > new Date(user.emailVerificationCodeExpiresAt)) {
      return res.status(400).render("pages/auth/verify", {
        title: "Verify Email",
        errors: { general: "Verification code expired" },
        old: {}
      });
    }

    const providedHash = hmacHash(code);
    if (providedHash !== user.emailVerificationCodeHash) {
      return res.status(400).render("pages/auth/verify", {
        title: "Verify Email",
        errors: { general: "Invalid verification code" },
        old: {}
      });
    }

    user.emailVerifiedAt = new Date();
    user.emailVerificationCodeHash = null;
    user.emailVerificationCodeExpiresAt = null;
    await user.save();

    return res.redirect("/");

  } catch (error) {
    return res.status(500).render("pages/auth/verify", {
      title: "Verify Email",
      errors: { general: error.message || "Something went wrong" },
      old: {}
    });
  }
}; 