import { Bot, Plus } from "lucide-react";

function ChatSidebar() {

  // Temporary user data
  const user = {
    fullName: "Ajel Mathew",
    email: "ajel@example.com"
  };

  return (
    <div className="w-[260px] sm:w-[280px] bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen">

      {/* Logo Section */}

      <div className="p-4 border-b border-zinc-800">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center">
            <Bot size={24} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              Aurex AI
            </h1>

            <p className="text-xs text-zinc-400">
              Smart Memory Assistant
            </p>
          </div>

        </div>

      </div>

      {/* New Chat Button */}

      <div className="p-4">

        <button
          className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          New Chat
        </button>

      </div>

      {/* Chat History */}

      <div className="flex-1 overflow-y-auto px-3 space-y-2 pb-4">

        <div className="bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer rounded-xl p-3">
          <p className="text-sm text-white">
            JWT Authentication
          </p>
        </div>

        <div className="bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer rounded-xl p-3">
          <p className="text-sm text-white">
            Explain APIs
          </p>
        </div>

      </div>

      {/* User Section */}

      <div className="mt-auto p-4 border-t border-zinc-800 bg-zinc-950">

        <div className="bg-zinc-900 rounded-2xl p-3 flex items-center gap-3">

          <div className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center font-bold">
            {user.fullName.charAt(0)}
          </div>

          <div className="overflow-hidden">

            <p className="text-sm font-semibold text-white truncate">
              {user.fullName}
            </p>

            <p className="text-xs text-zinc-400 truncate">
              {user.email}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ChatSidebar;