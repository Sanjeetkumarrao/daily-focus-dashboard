import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export default async function getAuthenticatedUser(){
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if(!token){
        throw new Error(
            "Unauthorized."
        )
    }

    const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET
    );

    await dbConnect();
    const user_id = decoded.userId;
    const user = await User.findById(user_id).select("-passwordHash");

    if(!user){
        throw new Error(
            "Unauthorized."
        )
    }

    return user
}