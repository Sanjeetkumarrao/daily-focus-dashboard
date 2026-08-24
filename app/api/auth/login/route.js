import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request){
    try {
        const {email, password} = await request.json();
        if(!email || !password){
            return Response.json(
                {message: "All fields required"},
                {status: 400},
            )
        }
        const cleanEmail = email.trim().toLowerCase();
        if(!cleanEmail.includes("@")){
            return Response.json(
                {message: "invalid credentials."},
                {status: 400},
            )
        }

        await dbConnect();
        const existingUser = await User.findOne({"email": cleanEmail});

        if(!existingUser){
            return Response.json(
                {message: "Invalid credentials"},
                {status: 401}
            )
        }
        const storedPassword = existingUser.passwordHash
        const passwordValid = await bcrypt.compare( password, storedPassword )
        
        if(!passwordValid){
            return Response.json(
                {message: "Unauthorized request"},
                {status: 401}
            )
        }

        const token = jwt.sign(
            {userId : existingUser._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        const cookieStore = await cookies();
        cookieStore.set("authToken", token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: '/',
            maxAge: 60*60*24*7
        });

        return Response.json(
            {message: "Login successfully"},
            {status: 200}
        )

    } catch (error) {
        return Response.json(
            {message: "Internal server Error"},
            {status: 500}
        )
    }
}