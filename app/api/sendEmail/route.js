import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use any other email provider
      auth: {
        user: "burhanahmad1616j@gmail.com", // Your email address
        pass: "rwcp tsfm wyas wlsb ", // App password from your email provider
      },
    });

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    const mailOptions = {
      from: "burhanahmad1616j@gmail.com",
      to: email,
      subject: "Verify Your Email",
      text: `Your OTP code for verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: "Email sent successfully", otp }), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: "Invalid Email Address!" }), { status: 500 });
  }
}
