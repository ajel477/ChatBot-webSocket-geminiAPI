import { useState } from "react";
import { useParams } from "react-router-dom";
import { Menu } from "lucide-react";

import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

function ChatPage() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { chatId } = useParams();

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden relative">

      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            lg:hidden
          "
        />
      )}

      {/* Sidebar */}

      <div
        className={`
          fixed
          lg:relative
          z-50
          h-full
          transition-transform
          duration-300

          ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <ChatSidebar />
      </div>

      {/* Main Chat Area */}

      <div className="flex-1 flex flex-col w-full">

        {/* Mobile Header */}

        <div className="lg:hidden flex items-center gap-4 px-4 py-4 border-b border-zinc-800 bg-black">

          <button
            onClick={() => setSidebarOpen(true)}
            className="
              w-10
              h-10
              rounded-xl
              bg-zinc-900
              border
              border-zinc-800
              flex
              items-center
              justify-center
            "
          >
            <Menu size={20} />
          </button>

          <h1 className="font-semibold text-lg">
            Aurex AI
          </h1>

        </div>

        <ChatWindow chatId={chatId} />

      </div>

    </div>
  );
}

export default ChatPage;