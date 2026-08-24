import { cookies } from "next/headers";

export async function POST(request){
    try {
        const cookieStore = await cookies();
        cookieStore.delete("authToken");
    
        return Response.json(
            {message: "logout successfully"},
            {status: 200}
        )
    } catch (error) {
        return Response.json(
            {message: "Unauthorized"},
            {status: 500}
        )
    }
}