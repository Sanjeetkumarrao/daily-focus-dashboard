import dbConnect from "@/lib/db";

export async function GET(){
    await dbConnect();
    return Response.json({
        status: 200,
        message: "connected"
    })
} 