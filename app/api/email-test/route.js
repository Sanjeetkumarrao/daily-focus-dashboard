import { sendVerificationEmail } from "@/lib/mail";

export async function GET() {
    try {
        const result = await sendVerificationEmail(
            "ishugeet86@gmail.com",
            "http://localhost:3000/verify-email?token=test123"
        );

        console.log("EMAIL RESULT:", result);

        return Response.json({
            message: "Test email sent successfully.",
        });
    } catch (error) {
        console.log("EMAIL ERROR:", error);

        return Response.json(
            {
                message: "Failed to send test email.",
            },
            {
                status: 500,
            }
        );
    }
}