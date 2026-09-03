import getAuthenticatedUser from "@/helpers/cookieVerify";
import { generateAIResponse } from "@/lib/gemini";

export async function POST(request) {
    try {
        const body = await request.json();

        const {
            title,
            description,
            priority,
            category
        } = body;

        if (!title || !description) {
            return Response.json(
                {
                    message: "Title and description are required."
                },
                { status: 400 }
            );
        }

        const user = await getAuthenticatedUser();

        const prompt = `
            You are a productivity assistant.

            Break the following task into 3 to 7 small,
            practical and actionable steps.

            Task title: ${title}
            Task description: ${description}
            Priority: ${priority || "low"}
            Category: ${category || "Other"}

            Return the result as a JSON object with exactly
            one property called "steps".

            "steps" must be an array of strings.

            Do not include any other properties.
        `;



        const response = await generateAIResponse(prompt, {
            responseMimeType: "application/json",
        });

        const result = JSON.parse(response);

        if (
            !result ||
            !Array.isArray(result.steps) ||
            result.steps.length < 3 ||
            result.steps.length > 7 ||
            !result.steps.every(step => typeof step === "string")
        ) {
            return Response.json(
                {
                    message: "AI returned an invalid response."
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                message: "Task breakdown generated successfully.",
                steps: result.steps
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