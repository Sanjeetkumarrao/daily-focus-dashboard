import getAuthenticatedUser from "@/helpers/cookieVerify";
import dbConnect from "@/lib/db";
import Task from "@/models/Task";

export async function PATCH(request, {params}){
    try {
        const {id: taskId} = await params;
        const body = await request.json();

        if (!body || Object.keys(body).length === 0) {
            return Response.json(
                { error: 'Invalid request.' },
                { status: 400 }
            );
        }

        const update = {}

        if(body.status !== undefined){
            if(!["pending", "completed"].includes(body.status)){
                return Response.json(
                    { message: "Invalid status." },
                    { status: 400 }
                );

            }
            update.status = body.status;
            if(update.status === "completed"){
                update.completedAt = new Date();
            }
            if(update.status === "pending"){
                update.completedAt = null;
            }
        }

        const user = await getAuthenticatedUser();
        await dbConnect();

        const updatedCompleteStatus = await Task.findOneAndUpdate(
            {
                _id: taskId,
                userId: user._id
            },
            update,
            {
                new: true,
                runValidators: true
            }
        )

        if(!updatedCompleteStatus){
            return Response.json(
                {message: "Task not found"},
                {status: 404},
            )
        }

        if (update.status === "completed") {
            return Response.json(
                { message: "Task marked as completed" },
                { status: 200 }
            );
        }

        if (update.status === "pending") {
            return Response.json(
                { message: "Task marked as pending" },
                { status: 200 }
            );
        }
        
    } catch (error) {
        return Response.json(
            {message: "Something went wrong"},
            {status: 500}
        )
    }
}