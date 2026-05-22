import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader } from "lucide-react";

import MessageBubble from "./MessageBubble";
import socket from "../services/socket";
import api from "../services/api";

function ChatWindow({ chatId }) {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [chatTitle, setChatTitle] = useState("Chat");
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat messages when chatId changes
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setChatTitle("Chat");
      return;
    }

    loadChatMessages();
  }, [chatId]);

  // Load previous messages for a chat
  const loadChatMessages = async () => {
    try {
      setLoadingMessages(true);
      setMessages([]);
      setError(null);

      console.log("📥 Loading messages for chat:", chatId);
      
      const response = await api.get(`/chat/${chatId}/messages`);
      
      const formattedMessages = response.data.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        _id: msg._id
      }));
      
      setMessages(formattedMessages);
      console.log("✅ Loaded", formattedMessages.length, "messages");
      
      // Get chat title
      const chatResponse = await api.get(`/chat/${chatId}`);
      setChatTitle(chatResponse.data.chat.title || "Chat");
      
    } catch (err) {
      console.error("❌ Error loading messages:", err);
      setError("Failed to load chat history");
    } finally {
      setLoadingMessages(false);
    }
  };

  // Socket listeners for real-time messaging
  useEffect(() => {
    console.log("🔌 Setting up socket listeners");
    
    // Check socket connection status
    if (socket.connected) {
      console.log("✅ Socket already connected");
    } else {
      console.log("⏳ Socket not connected yet");
    }

    socket.on("connect", () => {
      console.log("✅ Socket connected - ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("ai-stream", (data) => {

  console.log("📡 Streaming chunk received");

  setMessages((prev) => {

    const updated = [...prev];

    const lastMessage =
      updated[updated.length - 1];

    // If AI message already exists,
    // update progressively

    if (lastMessage?.role === "model") {

      lastMessage.content = data.content;

      return [...updated];
    }

    // Otherwise create new AI message

    return [
      ...updated,
      {
        role: "model",
        content: data.content
      }
    ];

  });

});

socket.on("ai-stream-end", () => {

  console.log("✅ Stream finished");

  setIsLoading(false);

  window.dispatchEvent(
    new Event("chat-updated")
  );

});

    socket.on("chat-title-updated", (data) => {
      if (!data?.chat || data.chat !== chatId) return;
      console.log("✅ Chat title updated via socket:", data.title);
      setChatTitle(data.title);
      window.dispatchEvent(new Event("chat-updated"));
    });

    // Listen for errors
    socket.on("ai-error", (data) => {
      console.error("❌ AI Error:", data);
      setError(data.message || "An error occurred");
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: data.message || "Failed to generate response",
        },
      ]);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("ai-stream");
      socket.off("ai-stream-end");
      socket.off("chat-title-updated");
      socket.off("ai-error");
    };
  }, [chatId]);

  function handleSendMessage(e) {
    e.preventDefault();

    if (!message.trim() || !chatId) {
      console.log("⚠️  Cannot send: chatId exists?", !!chatId, "message?", !!message.trim());
      return;
    }

    console.log("📨 Sending message to backend");
    console.log("📝 Message:", message);
    console.log("🆔 Chat ID:", chatId);

    // Add user message to UI
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    // Emit message to backend via socket
    console.log("🚀 Emitting ai-message event...");
    socket.emit("ai-message", {
      content: message,
      chat: chatId,
    });
    console.log("✅ ai-message emitted");

    setMessage("");
    setIsLoading(true);
    setError(null);
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] relative overflow-hidden">

      {/* Glow */}

      <div className="absolute top-[-200px] left-[20%] w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-zinc-800 opacity-20 blur-[120px] rounded-full" />

      {/* Desktop Header */}

      <div className="hidden lg:block relative z-10 px-8 py-5 border-b border-zinc-800 backdrop-blur-xl bg-black/40">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-xl font-semibold text-white">
              {chatTitle}
            </h1>

            <p className="text-sm text-zinc-400 mt-1">
              Your intelligent hybrid-memory assistant
            </p>
          </div>

          <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            Online
          </div>

        </div>

      </div>

      {/* Messages */}

      <div className="relative z-10 flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-8">

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">

          {loadingMessages && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader className="animate-spin" size={24} />
                <p className="text-zinc-400">Loading chat history...</p>
              </div>
            </div>
          )}

          {!chatId && !loadingMessages && (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-lg">
                Start a new chat to begin messaging
              </p>
            </div>
          )}

          {messages.length === 0 && chatId && !isLoading && !loadingMessages && (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-lg">
                No messages yet. Start typing to chat with Aurex!
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <MessageBubble
              key={msg._id || index}
              role={msg.role}
              content={msg.content}
            />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-zinc-400">
              <Loader className="animate-spin" size={18} />
              <span>Aurex is thinking...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />

        </div>

      </div>

      {/* Input */}

      <div className="relative z-10 px-3 sm:px-6 pb-3 sm:pb-6">

        <div className="max-w-4xl mx-auto">

          <form
            onSubmit={handleSendMessage}
            className="
              bg-zinc-900/80
              backdrop-blur-xl
              border
              border-zinc-800
              rounded-2xl sm:rounded-3xl
              p-2 sm:p-3
              shadow-2xl
            "
          >

            <div className="flex items-end gap-2 sm:gap-3">

              <textarea
                rows={1}
                placeholder="Message Aurex..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="
                  flex-1
                  resize-none
                  bg-transparent
                  text-white
                  text-sm sm:text-base
                  placeholder:text-zinc-500
                  outline-none
                  px-2 sm:px-3
                  py-2 sm:py-3
                  max-h-40
                "
              />

              <button
                disabled={isLoading || !chatId || !message.trim()}
                className="
                  w-10
                  h-10
                  sm:w-12
                  sm:h-12
                  rounded-xl sm:rounded-2xl
                  bg-white
                  text-black
                  flex
                  items-center
                  justify-center
                  hover:scale-105
                  transition
                  shrink-0
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {isLoading ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <ArrowUp size={18} />
                )}
              </button>

            </div>

          </form>

          <p className="text-center text-[10px] sm:text-xs text-zinc-500 mt-3 sm:mt-4 px-4">
            Aurex can make mistakes. Verify important information.
          </p>

        </div>

      </div>

    </div>
  );
}

export default ChatWindow;