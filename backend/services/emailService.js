const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const sendOTP = async (userEmail, otp) => {
  try {
    const mailOptions = {
            from: `"Luxe Estates" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Verify Your Email - Luxe Estates', 
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
            `
        };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to: ${userEmail}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

module.exports = { sendOTP };
