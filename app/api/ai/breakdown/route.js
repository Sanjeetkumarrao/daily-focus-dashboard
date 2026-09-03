import { generateAIResponse } from "@/lib/gemini";

export async function POST(request) {
    try {
        const body = await request.json();

        const { title, description, priority, category } = body;

        if (!title || !description) {
            return Response.json(
                { message: "Title and description are required." },
                { status: 400 }
            );
        }

        const prompt = `
You are a productivity assistant.

Break the following task into small, practical and actionable steps.

Task title: ${title}
Task description: ${description}
Priority: ${priority || "low"}
Category: ${category || "Other"}

Give 3 to 7 actionable steps.
Keep each step concise.
`;

        const response = await generateAIResponse(prompt);

        return Response.json(
            {
                message: "Task breakdown generated successfully.",
                response,
            },
            { status: 200 }
        );

    } catch (error) {
        console.log(error);

        return Response.json(
            {
                message: "Something went wrong while generating task breakdown."
            },
            { status: 500 }
        );
    }
}