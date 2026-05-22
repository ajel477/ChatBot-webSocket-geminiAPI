import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bot, Plus, Loader, Trash2, LogOut } from "lucide-react";
import api from "../services/api";

function ChatSidebar() {

  const navigate = useNavigate();
  const { chatId } = useParams();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);

  // Temporary user data
 const [user, setUser] = useState(null);

  // Fetch all chats on component mount
useEffect(() => {

  fetchChats();
  fetchProfile();

  window.addEventListener(
    "chat-updated",
    fetchChats
  );

  return () => {
    window.removeEventListener(
      "chat-updated",
      fetchChats
    );
  };

}, []);

  const fetchChats = async () => {
    try {
      setLoadingChats(true);
      const response = await api.get("/chat");
      console.log("✅ Fetched chats:", response.data.chats?.length || 0);
      setChats(response.data.chats || []);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setChats([]);
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchProfile = async () => {

  try {

    const response = await api.get("/auth/profile");

    console.log("✅ User profile:", response.data.user);

    setUser(response.data.user);

  } catch (error) {

    console.log(error);

  }
};

  const [deletingChatId, setDeletingChatId] = useState(null);

  const handleNewChat = async () => {
    try {
      setLoading(true);
      const response = await api.post("/chat", {
        title: "New Chat"
      });
      
      const newChat = response.data.chat;
      console.log("✅ New chat created:", newChat._id);
      setChats((prev) => [newChat, ...prev]);
      navigate(`/chat/${newChat._id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatIdToDelete) => {
    const shouldDelete = window.confirm("Delete this chat? This cannot be undone.");
    if (!shouldDelete) return;

    try {
      setDeletingChatId(chatIdToDelete);
      await api.delete(`/chat/${chatIdToDelete}`);
      setChats((prev) => prev.filter((chat) => chat._id !== chatIdToDelete));

      if (chatId === chatIdToDelete) {
        navigate("/chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      window.alert("Failed to delete chat. Please try again.");
    } finally {
      setDeletingChatId(null);
    }
  };

  const handleLogout = async () => {

  try {

    await api.post("/auth/logout");

    navigate("/login");

  } catch (error) {

    console.log(error);

    alert("Logout failed");

  }

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
          onClick={handleNewChat}
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus size={18} />
              New Chat
            </>
          )}
        </button>

      </div>

      {/* Chat History */}

      <div className="flex-1 overflow-y-auto px-3 space-y-2 pb-4">

        {loadingChats ? (
          <div className="flex items-center justify-center py-8">
            <Loader size={20} className="animate-spin text-zinc-400" />
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-zinc-500">No chats yet</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`w-full rounded-xl p-3 transition flex items-start justify-between gap-3 ${
                chatId === chat._id
                  ? "bg-white/20 border border-white/30"
                  : "bg-zinc-900 hover:bg-zinc-800"
              }`}
            >
              <button
                type="button"
                onClick={() => navigate(`/chat/${chat._id}`)}
                className="flex-1 text-left"
              >
                <p className="text-sm text-white truncate font-medium">
                  {chat.title || "Untitled Chat"}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {new Date(chat.lastActivity || chat.createdAt).toLocaleDateString()}
                </p>
              </button>

              <button
                type="button"
                onClick={(e) => {
  e.stopPropagation();
  handleDeleteChat(chat._id);
}}
                disabled={deletingChatId === chat._id}
                className="ml-2 p-2 rounded-xl bg-red-600/10 text-red-300 hover:bg-red-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingChatId === chat._id ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          ))
        )}

      </div>

      {/* User Section */}

      <div className="mt-auto p-4 border-t border-zinc-800 bg-zinc-950">

        <div className="bg-zinc-900 rounded-2xl p-3 flex items-center gap-3">

          <div className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center font-bold">
            {user?.fullName?.firstName?.charAt(0) || "U"}
          </div>

          <div className="overflow-hidden">

            <p className="text-sm font-semibold text-white truncate">
              {user
  ? `${user.fullName.firstName} ${user.fullName.lastName || ""}`
  : "User"
}
            </p>

            <p className="text-xs text-zinc-400 truncate">
              {user?.email || "user@example.com"}
            </p>

          </div>

        </div>

      </div>
          <button
  onClick={handleLogout}
  className="
    mt-3
    w-full
    bg-red-500/10
    hover:bg-red-500/20
    border
    border-red-500/20
    text-red-300
    py-2.5
    rounded-xl
    flex
    items-center
    justify-center
    gap-2
    transition
  "
>

  <LogOut size={16} />

  Logout

</button>

    </div>

  );
}

export default ChatSidebar;