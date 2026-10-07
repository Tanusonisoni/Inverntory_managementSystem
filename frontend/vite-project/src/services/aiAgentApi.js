import { axiosClient } from "./apiClient";
import { Urls } from "./urls";

export async function askAIAgent(sessionId, message) {
    const response = await axiosClient.post(Urls.aiAsk, { sessionId, message });

    if (response.data?.success !== true || typeof response.data?.answer !== "string") {
        throw new Error(response.data?.message || "The AI assistant returned an unexpected response.");
    }

    return response.data.answer;
}
