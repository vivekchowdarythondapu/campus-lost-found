const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMatchEmail = async (to, itemTitle, matchCount) => {
  try {
    await transporter.sendMail({
      from: `"Campus Lost & Found" <${process.env.EMAIL_USER}>`,
      to,
      subject: '🎉 Potential Match Found for Your Item!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Campus Lost & Found Portal</h2>
          <p>Great news! We found <strong>${matchCount} potential match(es)</strong> for your item:</p>
          <h3 style="color: #1d4ed8;">"${itemTitle}"</h3>
          <p>Please log in to the portal to view the matches and connect with the finder/owner.</p>
          <a href="${process.env.CLIENT_URL}" 
             style="background: #2563eb; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            View Matches
          </a>
          <p style="color: #6b7280; margin-top: 20px;">Campus Lost & Found Team</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Email error:', error);
  }
};

module.exports = { sendMatchEmail };