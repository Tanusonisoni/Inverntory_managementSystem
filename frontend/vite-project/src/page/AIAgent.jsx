import { useEffect, useRef, useState } from "react";
import { askAIAgent } from "../services/aiAgentApi";

const suggestions = [
    "Wireless Keyboard ka stock batao",
    "Low stock products dikhao",
    "Top stock-out products kaunse hain?",
    "Wireless Keyboard ka supplier kaun hai?",
    "Recent stock movement batao",
];

function createSessionId() {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }

    return `ai-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getErrorMessage(error) {
    if (error.response?.status === 401) {
        return "Your login token was rejected or has expired. Please log out and sign in again.";
    }

    if (error.response?.status === 403) {
        return "Your account is not authorized to use the AI assistant.";
    }

    return error.response?.data?.message
        || error.message
        || "Unable to reach the AI assistant. Please try again.";
}

const AIAgent = () => {
    const [sessionId, setSessionId] = useState(createSessionId);
    const [messages, setMessages] = useState([]);
    const [draft, setDraft] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [retryMessage, setRetryMessage] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading, error]);

    const requestAnswer = async (message, activeSessionId) => {
        setIsLoading(true);
        setError("");
        setRetryMessage("");

        try {
            const answer = await askAIAgent(activeSessionId, message);
            setMessages((current) => [
                ...current,
                { id: createSessionId(), role: "assistant", content: answer },
            ]);
        } catch (requestError) {
            setError(getErrorMessage(requestError));
            setRetryMessage(
                requestError.response?.status === 401 || requestError.response?.status === 403
                    ? ""
                    : message
            );
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (message = draft) => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage || isLoading) return;

        setMessages((current) => [
            ...current,
            { id: createSessionId(), role: "user", content: trimmedMessage },
        ]);
        setDraft("");
        await requestAnswer(trimmedMessage, sessionId);
    };

    const startNewChat = () => {
        if (isLoading) return;

        setSessionId(createSessionId());
        setMessages([]);
        setDraft("");
        setError("");
        setRetryMessage("");
        inputRef.current?.focus();
    };

    const retryLastMessage = () => {
        if (retryMessage && !isLoading) {
            requestAnswer(retryMessage, sessionId);
        }
    };

    const handleInputKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <section className="ai-page">
            <div className="ai-page-header">
                <div className="ai-title">
                    <span className="ai-title-mark" aria-hidden="true">AI</span>
                    <div>
                        <p className="eyebrow">Inventory intelligence</p>
                        <h1>Inventory AI Assistant</h1>
                        <p className="ai-subtitle">
                            Ask anything about your inventory, products, suppliers and stock movements.
                        </p>
                    </div>
                </div>
                <button
                    className="secondary-button"
                    type="button"
                    onClick={startNewChat}
                    disabled={isLoading}
                >
                    + New Chat
                </button>
            </div>

            <div className="ai-chat-panel">
                <div className="ai-messages" aria-live="polite" aria-label="Chat messages">
                    {messages.length === 0 ? (
                        <div className="ai-empty-state">
                            <span className="ai-empty-mark" aria-hidden="true">AI</span>
                            <h2>How can I help with your inventory?</h2>
                            <p>Ask a question or choose a suggestion to get started.</p>
                            <div className="ai-suggestions">
                                {suggestions.map((suggestion) => (
                                    <button
                                        className="ai-suggestion"
                                        key={suggestion}
                                        type="button"
                                        onClick={() => sendMessage(suggestion)}
                                        disabled={isLoading}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="ai-message-list">
                            {messages.map((message) => (
                                <div className={`ai-message-row ${message.role}`} key={message.id}>
                                    {message.role === "assistant" && (
                                        <span className="ai-message-avatar" aria-hidden="true">AI</span>
                                    )}
                                    <div className="ai-message-bubble">{message.content}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {isLoading && (
                        <div className="ai-message-row assistant" role="status" aria-label="AI is responding">
                            <span className="ai-message-avatar" aria-hidden="true">AI</span>
                            <div className="ai-typing-indicator">
                                <span />
                                <span />
                                <span />
                                <span className="sr-only">AI is responding</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="ai-error" role="alert">
                            <p>{error}</p>
                            {retryMessage && (
                                <button
                                    className="ai-retry-button"
                                    type="button"
                                    onClick={retryLastMessage}
                                    disabled={isLoading}
                                >
                                    Try again
                                </button>
                            )}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form
                    className="ai-composer"
                    onSubmit={(event) => {
                        event.preventDefault();
                        sendMessage();
                    }}
                >
                    <label className="sr-only" htmlFor="ai-message-input">Ask the AI assistant</label>
                    <textarea
                        id="ai-message-input"
                        ref={inputRef}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleInputKeyDown}
                        placeholder="Ask about stock, products, suppliers..."
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        className="ai-send-button"
                        type="submit"
                        disabled={isLoading || !draft.trim()}
                        aria-label="Send message"
                    >
                        {isLoading ? "..." : "Send"}
                    </button>
                    <p className="ai-composer-hint">Enter to send · Shift + Enter for a new line</p>
                </form>
            </div>
        </section>
    );
};

export default AIAgent;
