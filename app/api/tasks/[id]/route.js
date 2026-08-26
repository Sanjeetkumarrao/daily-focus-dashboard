import getAuthenticatedUser from "@/helpers/cookieVerify";
import dbConnect from "@/lib/db";
import Task from "@/models/Task";

export async function PATCH(request, { params }) {
    try {
        const { id: taskId } = await params;

        const body = await request.json();

        if (!body || Object.keys(body).length === 0) {
            return Response.json(
                { message: "No data provided for update." },
                { status: 400 }
            );
        }

        const updates = {};

        if (body.title !== undefined) {
            const title = body.title.trim();

            if (title.length < 2) {
                return Response.json(
                    { message: "Invalid title." },
                    { status: 400 }
                );
            }

            updates.title = title;
        }

        if (body.description !== undefined) {
            const description = body.description.trim();

            if (description.length < 6) {
                return Response.json(
                    { message: "Invalid description." },
                    { status: 400 }
                );
            }

            updates.description = description;
        }

        if (body.category !== undefined) {
            updates.category = body.category.trim();
        }

        if (body.priority !== undefined) {
            if (!["low", "medium", "high"].includes(body.priority)) {
                return Response.json(
                    { message: "Invalid priority." },
                    { status: 400 }
                );
            }

            updates.priority = body.priority;
        }

        if (body.dueDate !== undefined) {
            updates.dueDate = body.dueDate;
        }

        if (Object.keys(updates).length === 0) {
            return Response.json(
                { message: "No valid fields to update." },
                { status: 400 }
            );
        }

        const user = await getAuthenticatedUser();

        await dbConnect();

        const updatedTask = await Task.findOneAndUpdate(
            {
                _id: taskId,
                userId: user._id
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedTask) {
            return Response.json(
                { message: "Task not found." },
                { status: 404 }
            );
        }

        return Response.json(
            {
                message: "Task updated successfully.",
                task: updatedTask
            },
            { status: 200 }
        );

    } catch (error) {
        console.log(error);

        return Response.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id: taskId } = await params;

        const user = await getAuthenticatedUser();

        await dbConnect();

        const deletedTask = await Task.findOneAndDelete({
            _id: taskId,
            userId: user._id
        });

        if (!deletedTask) {
            return Response.json(
                { message: "Task not found" },
                { status: 404 }
            );
        }

        return Response.json(
            {
                message: "Task deleted successfully",
                deletedTask
            },
            { status: 200 }
        );

    } catch (error) {
        console.log(error);

        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}