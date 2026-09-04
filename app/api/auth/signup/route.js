import bcrypt from "bcryptjs";
import crypto from "crypto";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(request) {
    try {
        const body = await request.json();

        const { name, email, password } = body;

        // 1. Basic validation
        if (!name || !email || !password) {
            return Response.json(
                {
                    message: "Name, email and password are required.",
                },
                {
                    status: 400,
                }
            );
        }

        const trimmedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (trimmedName.length < 2) {
            return Response.json(
                {
                    message: "Name must be at least 2 characters.",
                },
                {
                    status: 400,
                }
            );
        }

        if (password.length < 6) {
            return Response.json(
                {
                    message: "Password must be at least 6 characters.",
                },
                {
                    status: 400,
                }
            );
        }

        // 2. Connect to database
        await dbConnect();

        // 3. Check whether email already exists
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return Response.json(
                {
                    message: "An account with this email already exists.",
                },
                {
                    status: 409,
                }
            );
        }

        // 4. Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // 5. Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        // 6. Hash verification token
        const verificationTokenHash = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        // 7. Token expiry
        const verificationTokenExpires = new Date(
            Date.now() + 60 * 60 * 1000
        );

        // 8. Create user
        await User.create({
            name: trimmedName,
            email: normalizedEmail,
            passwordHash,

            isEmailVerified: false,

            emailVerificationToken: verificationTokenHash,
            emailVerificationExpires: verificationTokenExpires,
        });

        // 9. Create verification URL
        const verificationUrl =
            `${process.env.NEXT_PUBLIC_APP_URL}/verify-email` +
            `?token=${verificationToken}`;

        // 10. Send verification email
        await sendVerificationEmail(
            normalizedEmail,
            verificationUrl
        );

        // 11. Response
        return Response.json(
            {
                message:
                    "Account created. Please check your email to verify your account.",
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.log(error);

        return Response.json(
            {
                message: "Something went wrong while creating your account.",
            },
            {
                status: 500,
            }
        );
    }
}