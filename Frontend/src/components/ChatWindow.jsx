import { useState } from "react";
import { ArrowUp } from "lucide-react";
import MessageBubble from "./MessageBubble";

function ChatWindow() {

  const [message, setMessage] = useState("");

  const messages = [
    {
      role: "model",
      content:
        "Arey bhai 😄 Main Aurex hoon. Kya scene hai?"
    },
    {
      role: "user",
      content:
        "JWT ko beginner friendly way mein explain karo"
    },
    {
      role: "model",
      content:
        "Simple 😄 JWT ek digital identity card ki tarah hota hai jo backend ko batata hai ki user authenticated hai."
    }
  ];

  function handleSendMessage(e) {
    e.preventDefault();

    console.log(message);

    setMessage("");
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
              Aurex AI
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

          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              role={msg.role}
              content={msg.content}
            />
          ))}

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
                "
              >
                <ArrowUp size={18} />
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