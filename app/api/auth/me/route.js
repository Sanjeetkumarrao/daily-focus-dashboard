import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(){
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("authToken")?.value;
    
        if(!token){
            return Response.json(
                {message: "Unauthorized."},
                {status: 401}
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
            return Response.json(
                {message: "Something went wrong."},
                {status: 404}
            )
        }
    
        return Response.json(
            {
                message: "User Found successfully",
                user: user
            },
            {status: 200}
        )
    } catch (error) {
        return Response.json(
            {message: "Invalid credentials"},
            {status: 401}
        )
    }
}