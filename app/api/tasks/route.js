import getAuthenticatedUser from "@/helpers/cookieVerify";
import dbConnect from "@/lib/db";
import Task from "@/models/Task";

export async function POST(request){
    try {
        const body = await request.json();
        const title = body.title;
        const description = body.description

        if(!title || !description){
            return Response.json(
                {message: "Fill the required fields."},
                {status:400},
            )
        }
        
        const cleanTitle = title.trim();
        const cleanDescription = description.trim();

        if(cleanTitle.length < 2 || cleanDescription.length < 6 ){
            return Response.json(
                {message: "inter valid title and description."},
                {status: 400}
            )
        }

        const user = await getAuthenticatedUser();

        await dbConnect();

        const task = await Task.create({
            userId: user._id,
            title: cleanTitle,
            description: cleanDescription
        })

        return Response.json(
            {
                message: "Task created",
                task
            },
            {status: 201},
        )
    } catch (error) {
        return Response.json(
            {
                message: "error while creating task"
            },
            { status: 500 }
        )
    }
}


export async function GET(request){
    try {
        const {searchParams} = new URL(request.url);

        const status = searchParams.get("status");
        const priority = searchParams.get("priority");

        const user = await getAuthenticatedUser();
        await dbConnect();

        const filter = {
            userId: user._id
        }

        if(status !== null){
            if(!["pending", "completed"].includes(status)){
                return Response.json(
                    {message: "Invalid status"},
                    {status: 400}
                )
            }
            filter.status = status;
        }

        if(priority !== null){
            if(!["low","medium" ,"high"].includes(priority)){
                return Response.json(
                    {message: "Invalid priority"},
                    {status: 400}
                )
            }
            filter.priority = priority;
        }

        const tasks = await Task.find(filter);

        if(tasks.length === 0){
            return Response.json(
                {
                    message: "No tasks found.",
                    tasks: []
                },
                { status: 200 }
            );
        }

        return Response.json(
            {
                message: "Tasks fetched successfully.",
                tasks
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}


// export async function GET(){
//     try {
//         const user = await getAuthenticatedUser();
//         await dbConnect();
//         const tasks = await Task.find({userId: user._id});
//         if(tasks.length === 0){
//             return Response.json(
//                 {message: "no tasks yet."},
//                 {status: 200}
//             )
//         }

//         return Response.json(
//             {message:"Tasks fetched successfully.",
//                 tasks
//             },
//             {status: 200}
//         )
//     } catch (error) {
//         return Response.json(
//             {message: "Invalid credentials"},
//             {status: 500}
//         )
//     }
// }

