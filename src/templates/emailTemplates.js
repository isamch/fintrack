
export const emailTemplates = {
  verification: ({ name, code }) => `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <h2>Verify your email</h2>
      <p>Hi ${name},</p>
      <p>Your verification code is:</p>
      <h1 style="color: #007BFF;">${code}</h1>
      <p>This code will expire in 10 minutes.</p>
    </div>
  `,

  welcome: ({ name }) => `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <h2>Welcome to Our App!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for joining us. We hope you enjoy our services.</p>
    </div>
  `,

  // updated to OTP-based reset template
  resetPasswordOtp: ({ name, code }) => `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <h2>Password Reset Code</h2>
      <p>Hi ${name},</p>
      <p>Your password reset code is:</p>
      <h1 style="color: #d9534f;">${code}</h1>
      <p>This code will expire in 10 minutes. If you did not request this, you can ignore this email.</p>
    </div>
  `
};
