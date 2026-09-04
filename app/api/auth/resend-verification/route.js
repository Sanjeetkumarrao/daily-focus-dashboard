import dbConnect from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(request){
    try {
        const body = await request.json();

        const trimmedEmail = body.email.trim().toLowerCase();
        if(!body.email || trimmedEmail.length < 2){
            return Response.json(
                {message: "Invalid credentials"},
                {status: 400}
            )
        }

        await dbConnect();
        const user = await User.findOne({email: trimmedEmail})

        if(!user){
            return Response.json(
                {message: `If the account exists and is unverified,
a verification email has been sent.`},
                {status: 400}
            )
        }

        if(user.isEmailVerified === true){
            return Response.json(
                {message: "Email already verified."},
                {status: 200}
            )
        }

        const verificationToken = crypto.randomBytes(32).toString("hex")

        const verificationTokenHash = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex")

        const verificationTokenExpires = new Date(
            Date.now() + 60 * 60 * 1000
        );

        const updates = {
            emailVerificationToken: verificationTokenHash,
            emailVerificationExpires: verificationTokenExpires
        }

        await User.findOneAndUpdate({email : trimmedEmail},
            updates,
            {
                runValidators: true
            }
        )

        const verificationUrl =
            `${process.env.NEXT_PUBLIC_APP_URL}/verify-email` +
            `?token=${verificationToken}`;

        await sendVerificationEmail(
            trimmedEmail,
            verificationUrl
        )

        return Response.json(
                {message: "Email re-send successfully "},
                {status: 200}
        )
    } catch (error) {
        console.log(error);
        return Response.json(
            {message: "Something went wrong "},
            {status: 500}
        )
    }
}