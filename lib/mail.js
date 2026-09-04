import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendVerificationEmail(email, verificationUrl) {
    const result = await transporter.sendMail({
        from: `"Daily Focus" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your Daily Focus account",

        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Welcome to Daily Focus</h2>

                <p>
                    Thanks for creating your account.
                    Please verify your email address to continue.
                </p>

                <a
                    href="${verificationUrl}"
                    style="
                        display: inline-block;
                        padding: 12px 20px;
                        background: #171717;
                        color: white;
                        text-decoration: none;
                        font-weight: bold;
                    "
                >
                    Verify Email
                </a>

                <p style="margin-top: 20px;">
                    This verification link will expire in 1 hour.
                </p>
            </div>
        `,
    });

    return result;
}