import { generateAIResponse } from "@/lib/gemini";

export async function POST(request) {
    try {
        const body = await request.json();

        if (!body.prompt) {
            return Response.json(
                { message: "Prompt is required." },
                { status: 400 }
            );
        }

        const response = await generateAIResponse(body.prompt);

        return Response.json(
            {
                message: "AI response generated successfully.",
                response,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);

        return Response.json(
            {
                message: "Something went wrong while generating AI response.",
            },
            { status: 500 }
        );
    }
}