import crypto from "crypto";

import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(request) {
    try {
        // 1. URL se token nikalo
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");

        if (!token) {
            return Response.json(
                {
                    message: "Verification token is required.",
                },
                {
                    status: 400,
                }
            );
        }

        // 2. Raw token ko hash karo
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // 3. Database connect
        await dbConnect();

        // 4. Matching user find karo
        const user = await User.findOne({
            emailVerificationToken: tokenHash,
        });

        if (!user) {
            return Response.json(
                {
                    message: "Invalid verification token.",
                },
                {
                    status: 400,
                }
            );
        }

        // 5. Check karo token expire toh nahi ho gaya
        if (
            !user.emailVerificationExpires ||
            user.emailVerificationExpires < new Date()
        ) {
            return Response.json(
                {
                    message: "Verification token has expired.",
                },
                {
                    status: 400,
                }
            );
        }

        // 6. Email verified
        user.isEmailVerified = true;

        // 7. Token ko invalidate karo
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;

        await user.save();

        return Response.json(
            {
                message: "Email verified successfully.",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log(error);

        return Response.json(
            {
                message: "Something went wrong while verifying your email.",
            },
            {
                status: 500,
            }
        );
    }
}