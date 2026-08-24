import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request){
    try {
        const body = await request.json();
        const {name, email, password} = body;
        
        if(!email || !name || !password){
            return Response.json(
                {message: "All fields are required."},
                {status: 400}
            );
        }
        
        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if(cleanName.length < 2){
            return Response.json(
                {message: "Invalid name"},
                {status: 400}
            )
        }
        if(password.length < 6){
            return Response.json(
                {message: "Invalid password"},
                {status: 400}
            )
        }
        if(!cleanEmail.includes("@")){
            return Response.json(
                {message: "invalid credentials"},
                {status: 400}
            )
        }

        await dbConnect();

        const existingUser = await User.findOne({"email" : cleanEmail})

        if(existingUser){
            return Response.json(
                {message: "User Already Exists"},
                {status: 409}
            )
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            name: cleanName,
            email: cleanEmail,
            passwordHash: hashedPassword,
        })

        if(!user){
            return Response.json(
                {message: "Something went wrong "},
                {status: 500}
            )
        };

        return Response.json(
            {message: "User Created successfully"},
            {status: 201}
        )

    } catch (error) {
        return Response.json(
            {message: "something went wrong"},
            {status: 500}
        )
    }
}