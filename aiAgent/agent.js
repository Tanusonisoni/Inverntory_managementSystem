import openAI from "openai";

import {
    getLowStockProduct,
    getTopStockOutProduct,
    getProById
} from "./agentTools.js";


const client = new openAI();


const tools = [
    {
        type: "function",
        name: "getLowStockProduct",
        description: "Get all products whose quantity is low",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    },

    {
        type: "function",
        name: "getTopStockOutProduct",
        description: "Get products that have the highest total stock out quantity",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    },

    {
        type: "function",
        name: "getProById",
        description: "Get product details using the product ID",
        parameters: {
            type: "object",
            properties: {
                productId: {
                    type: "string",
                    description: "The MongoDB product ID"
                }
            },
            required: ["productId"]
        }
    }
];


export async function askAI(message) {

    // First AI call
    let response = await client.responses.create({
        model: "gpt-6-luna",
        input: message,
        tools: tools
    });


    // AI ke tool calls ko handle karne ke liye loop
    while (true) {

        const toolCalls = response.output.filter(
            (item) => item.type === "function_call"
        );


        // Agar koi tool call nahi hai,
        // iska matlab AI ne final answer de diya
        if (toolCalls.length === 0) {
            return response.output_text;
        }


        // Saare tool calls execute karenge
        const toolResults = await Promise.all(

            toolCalls.map(async (toolCall) => {

                const args = toolCall.arguments
                    ? JSON.parse(toolCall.arguments)
                    : {};


                let result;


                // Low stock tool
                if (toolCall.name === "getLowStockProduct") {

                    result = await getLowStockProduct();

                }


                // Top stock-out tool
                else if (toolCall.name === "getTopStockOutProduct") {

                    result = await getTopStockOutProduct();

                }


                // Product details tool
                else if (toolCall.name === "getProById") {

                    result = await getProById(args.productId);

                }


                // Unknown tool
                else {

                    result = {
                        error: `Unknown tool: ${toolCall.name}`
                    };

                }


                // Tool ka result AI ko wapas dena
                return {
                    type: "function_call_output",
                    call_id: toolCall.call_id,
                    output: JSON.stringify(result)
                };

            })

        );


        // Tool result ke saath AI ko dobara call karna
        response = await client.responses.create({

            model: "gpt-6-luna",

            previous_response_id: response.id,

            input: toolResults,

            tools: tools

        });

    }

    

}
 