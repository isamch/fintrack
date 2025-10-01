import User from "../models/User.js";
import { doHash, doHashValidation, hmacHash } from "../utils/hashing.js";
import { sendMail } from "../utils/email.js";
import { generateOTP } from "../utils/generateOTP.js";
import { createUserSession, destroyUserSession, setEmailVerifiedSession } from "../utils/session.js";


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

    createUserSession(req, user);

    return res.redirect("/verify");

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

    const user = await User.scope('auth').findOne({ where: { email } });
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

    createUserSession(req, user);

    if (!user.emailVerifiedAt) {
      setEmailVerifiedSession(req, false);
      return res.redirect('/verify');
    }

    setEmailVerifiedSession(req, true);
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
  await destroyUserSession(req);
  return res.redirect("/login");
};

export const postSendVerificationCode = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await User.scope('withSensitive').findByPk(userId);

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

    const user = await User.scope('withSensitive').findByPk(userId);

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

    setEmailVerifiedSession(req, true);

    return res.redirect("/");

  } catch (error) {
    return res.status(500).render("pages/auth/verify", {
      title: "Verify Email",
      errors: { general: error.message || "Something went wrong" },
      old: {}
    });
  }
};


// ===== Password Reset via OTP (Web) =====
export const renderForgotPassword = (req, res) => {
  return res.render("pages/auth/forgot", { title: "Forgot Password", errors: null, old: {} });
};

export const postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.scope('withSensitive').findOne({ where: { email } });


    // Always show generic success page/flash
    if (user) {
      const code = generateOTP(6);
      user.passwordResetCodeHash = hmacHash(code);
      user.passwordResetCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendMail({
        to: user.email,
        subject: "Your password reset code",
        templateName: "resetPasswordOtp",
        templateData: { name: user.name, code },
      });
    }

    return res.render("pages/auth/forgot", { title: "Forgot Password", errors: null, old: { info: "If the email exists, a code was sent." } });

  } catch (error) {
    return res.status(500).render("pages/auth/forgot", { title: "Forgot Password", errors: { general: error.message || "Something went wrong" }, old: req.body || {} });
  }
};

export const renderResetPassword = (req, res) => {
  // optional: pre-fill email from query if provided
  const { email = "" } = req.query || {};
  return res.render("pages/auth/reset", { title: "Reset Password", errors: null, old: { email } });
};

export const postResetPassword = async (req, res) => {
  try {
    const { email, code, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).render("pages/auth/reset", { title: "Reset Password", errors: { confirmNewPassword: "Passwords do not match" }, old: { email } });
    }

    const user = await User.scope('withSensitive').findOne({ where: { email } });
    if (!user) {
      return res.status(400).render("pages/auth/reset", { title: "Reset Password", errors: { general: "Invalid code or email" }, old: { email } });
    }

    if (!user.passwordResetCodeHash || !user.passwordResetCodeExpiresAt) {
      return res.status(400).render("pages/auth/reset", { title: "Reset Password", errors: { general: "No reset in progress" }, old: { email } });
    }

    if (new Date() > new Date(user.passwordResetCodeExpiresAt)) {
      return res.status(400).render("pages/auth/reset", { title: "Reset Password", errors: { general: "Reset code expired" }, old: { email } });
    }

    const providedHash = hmacHash(code);
    if (providedHash !== user.passwordResetCodeHash) {
      return res.status(400).render("pages/auth/reset", { title: "Reset Password", errors: { general: "Invalid reset code" }, old: { email } });
    }

    const hashed = await doHash(newPassword);
    user.password = hashed;
    user.passwordResetCodeHash = null;
    user.passwordResetCodeExpiresAt = null;
    await user.save();

    return res.redirect('/login');

  } catch (error) {
    return res.status(500).render("pages/auth/reset", { title: "Reset Password", errors: { general: error.message || "Something went wrong" }, old: req.body || {} });
  }
}; 