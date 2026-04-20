const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, name) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Campus Lost & Found" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for Campus Lost & Found Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #E8E8F0; padding: 30px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #6C63FF, #FF6584); width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: white;">LF</div>
          <h1 style="color: white; margin-top: 15px;">Campus Lost & Found</h1>
          <p style="color: #7A7A9A;">SRM AP University</p>
        </div>

        <div style="background: rgba(108,99,255,0.1); border: 1px solid rgba(108,99,255,0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
          <p style="color: #7A7A9A; margin-bottom: 10px;">Hi ${name}, your OTP is:</p>
          <div style="font-size: 48px; font-weight: bold; letter-spacing: 12px; color: white; margin: 15px 0;">
            ${otp}
          </div>
          <p style="color: #7A7A9A; font-size: 13px;">This OTP expires in <strong style="color: white;">10 minutes</strong></p>
        </div>

        <div style="background: rgba(255,77,109,0.1); border: 1px solid rgba(255,77,109,0.2); border-radius: 8px; padding: 12px; margin-bottom: 20px;">
          <p style="color: #FF4D6D; font-size: 12px; margin: 0;">
            ⚠️ Never share this OTP with anyone. Campus L&F will never ask for your OTP.
          </p>
        </div>

        <p style="color: #7A7A9A; font-size: 12px; text-align: center;">
          If you didn't request this OTP, please ignore this email.
        </p>
      </div>
    `
  });
};

module.exports = { generateOTP, sendOTPEmail };