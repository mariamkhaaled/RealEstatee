const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const buildInquiryNotificationTemplate = ({
  ownerName,
  propertyTitle,
  requesterName,
  requesterEmail,
  requesterPhone,
  message,
  viewRequestUrl,
}) => `
  <div style="max-width: 640px; margin: 24px auto; font-family: Helvetica, Arial, sans-serif; background: #ffffff; border: 1px solid #e8e8e8; border-radius: 16px; overflow: hidden; color: #1f2937;">
    <div style="padding: 28px 32px; background: #f8fafc; border-bottom: 1px solid #e5e7eb;">
      <div style="font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: #64748b;">LuxeEstates</div>
      <h1 style="margin: 10px 0 0; font-size: 24px; line-height: 1.3; color: #0f172a;">New inquiry received</h1>
      <p style="margin: 10px 0 0; color: #475569;">Hello ${ownerName || "Owner"}, a new request was submitted for your property.</p>
    </div>

    <div style="padding: 32px;">
      <div style="margin-bottom: 20px; padding: 18px 20px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 12px;">
        <p style="margin: 0 0 6px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b;">Property</p>
        <p style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a;">${propertyTitle}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; width: 140px;">Requester</td>
          <td style="padding: 8px 0; color: #111827; font-weight: 600;">${requesterName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Email</td>
          <td style="padding: 8px 0; color: #111827;">${requesterEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Phone</td>
          <td style="padding: 8px 0; color: #111827;">${requesterPhone}</td>
        </tr>
      </table>

      <div style="margin-top: 22px; padding: 18px 20px; background: #f8fafc; border-left: 4px solid #0f172a; border-radius: 10px;">
        <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b;">Message</p>
        <p style="margin: 0; color: #334155; line-height: 1.7;">${message}</p>
      </div>

      <div style="margin-top: 28px; text-align: center;">
        <a href="${viewRequestUrl}" style="display: inline-block; padding: 14px 24px; border-radius: 10px; background: #0f172a; color: #ffffff; text-decoration: none; font-weight: 600;">View Request</a>
      </div>
    </div>
  </div>
`;

const sendOTP = async (userEmail, otp) => {
  try {
    const mailOptions = {
      from: `"Luxe Estates" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Verify Your Email - Luxe Estates",
      html: `
                <div style="max-width: 600px; margin: 20px auto; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; border-radius: 15px; background-color: #fcfcfc; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #eee;">
                    <div style="background-color: #002347; padding: 40px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 30px; letter-spacing: 4px; font-weight: 300; text-transform: uppercase;">Luxe Estates</h1>
                        <p style="color: #a5b1c2; margin-top: 10px; font-size: 14px; letter-spacing: 1px;">PREMIUM REAL ESTATE SOLUTIONS</p>
                    </div>
                    
                    <div style="padding: 50px 40px; text-align: center;">
                        <h2 style="color: #002347; margin-bottom: 20px; font-size: 24px;">Confirm Your Registration</h2>
                        <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 30px;">
                            We are delighted to have you with us. Use the verification code below to complete your account setup:
                        </p>
                        
                        <div style="background-color: #f4f7f6; padding: 25px; border-radius: 10px; display: inline-block; min-width: 200px; border: 1px solid #e0e0e0;">
                            <span style="font-size: 42px; font-weight: bold; color: #002347; letter-spacing: 10px;">${otp}</span>
                        </div>
                        
                        <p style="color: #888; font-size: 13px; margin-top: 30px;">
                            This code will expire in 10 minutes for your security.
                        </p>
                    </div>
                    
                    <div style="background-color: #f1f2f6; padding: 25px; text-align: center;">
                        <p style="color: #95a5a6; font-size: 11px; margin: 0; line-height: 1.5;">
                            &copy; 2026 Luxe Estates | Helwan Engineering <br>
                            If you didn't request this, please ignore this email.
                        </p>
                    </div>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to: ${userEmail}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

const sendInquiryNotification = async ({
  to,
  ownerName,
  propertyTitle,
  requesterName,
  requesterEmail,
  requesterPhone,
  message,
  viewRequestUrl,
}) => {
  try {
    const mailOptions = {
      from: `"LuxeEstates" <${process.env.EMAIL_USER}>`,
      to,
      subject: `New inquiry for ${propertyTitle}`,
      html: buildInquiryNotificationTemplate({
        ownerName,
        propertyTitle,
        requesterName,
        requesterEmail,
        requesterPhone,
        message,
        viewRequestUrl,
      }),
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Inquiry email sent successfully to: ${to}`);
  } catch (error) {
    console.error("❌ Error sending inquiry email:", error);
    throw error;
  }
};

module.exports = { sendOTP, sendInquiryNotification };
