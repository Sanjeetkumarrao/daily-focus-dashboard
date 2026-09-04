import getAuthenticatedUser from "@/helpers/cookieVerify";
import dbConnect from "@/lib/db";
import Task from "@/models/Task";

export async function POST(request) {
    try {
        const body = await request.json();

        // Check whether tasks array exists
        if (!body.tasks || !Array.isArray(body.tasks)) {
            return Response.json(
                {
                    message: "Tasks must be an array.",
                },
                { status: 400 }
            );
        }

        // Empty array is not useful
        if (body.tasks.length === 0) {
            return Response.json(
                {
                    message: "At least one task is required.",
                },
                { status: 400 }
            );
        }

        // Limit bulk creation
        if (body.tasks.length > 10) {
            return Response.json(
                {
                    message: "You can create maximum 10 tasks at once.",
                },
                { status: 400 }
            );
        }

        // Authenticate user
        const user = await getAuthenticatedUser();

        const tasksToCreate = [];

        for (const task of body.tasks) {
            if (!task.title || !task.description) {
                return Response.json(
                    {
                        message:
                            "Every task must have title and description.",
                    },
                    { status: 400 }
                );
            }

            const title = task.title.trim();
            const description = task.description.trim();

            if (title.length < 2 || description.length < 6) {
                return Response.json(
                    {
                        message:
                            "Every task must have a valid title and description.",
                    },
                    { status: 400 }
                );
            }

            if (
                task.priority !== undefined &&
                !["low", "medium", "high"].includes(task.priority)
            ) {
                return Response.json(
                    {
                        message: "Invalid priority.",
                    },
                    { status: 400 }
                );
            }

            tasksToCreate.push({
                userId: user._id,
                title,
                description,
                category: task.category
                    ? task.category.trim()
                    : "Other",
                priority: task.priority || "low",
                dueDate: task.dueDate || undefined,
            });
        }

        await dbConnect();

        const createdTasks = await Task.insertMany(tasksToCreate);

        return Response.json(
            {
                message: "Tasks created successfully.",
                tasks: createdTasks,
            },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);

        return Response.json(
            {
                message: "Internal server error.",
            },
            { status: 500 }
        );
    }
}