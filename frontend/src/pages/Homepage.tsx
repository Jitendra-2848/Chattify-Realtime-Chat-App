import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import People from "./people";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/useThemeStore";
import {
  Video,
  Phone,
  Send,
  Trash2,
  MoreVertical,
  ArrowLeft,
  User,
  Ban,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface ChatMessage {
  _id: string;
  text: string;
  sender: string;
  receiverId?: string;
  createdAt: string;
}

const socket: Socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

const Homepage = () => {
  const { theme } = useThemeStore();
  const {
    sendmsg,
    currentChatuser,
    Chats,
    AuthUser,
    Allchatdel,
  } = useAuthStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const prevChatUserRef = useRef<string | null>(null);

  const isOnline = (id?: string) =>
    Boolean(id && onlineUsers.includes(id));

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  /*  SOCKET CONNECT */
  useEffect(() => {
    if (!AuthUser?._id) return;

    socket.emit("join", AuthUser._id);

    socket.on("onlineUsers", (data: string[]) => {
      setOnlineUsers(data);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, [AuthUser?._id]);

  /*  RECEIVE MESSAGE */
  useEffect(() => {
    const handleReceiveMessage = (data: ChatMessage) => {
      if (data.sender === currentChatuser?._id) {
        setMessages((prev) => [...prev, data]);
      } else {
        toast.success("New message received!");
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [currentChatuser?._id]);

  useEffect(() => {
    if (
      currentChatuser?._id &&
      currentChatuser._id !== prevChatUserRef.current
    ) {
      prevChatUserRef.current = currentChatuser._id;

      const normalized: ChatMessage[] = Array.isArray(Chats)
        ? Chats.map((m: any) => ({
            _id: m._id,
            text: m.text,
            sender: m.sender || m.from, // fallback
            receiverId: m.receiverId,
            createdAt: m.createdAt,
          }))
        : [];

      setMessages(normalized);
    }
  }, [currentChatuser?._id, Chats]);

  /* AUTOSCROLL */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* SEND MESSAGE */
  const handleSend = async () => {
    if (!newMessage.trim() || !currentChatuser || !AuthUser) return;

    const msg: ChatMessage = {
      _id: Date.now().toString(),
      text: newMessage,
      sender: AuthUser._id,
      receiverId: currentChatuser._id,
      createdAt: new Date().toISOString(),
    };

    setIsSending(true);
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");

    try {
      await sendmsg({ text: msg.text, id: currentChatuser._id });
      socket.emit("sendMessage", msg);
    } catch {
      toast.error("Failed to send");
      setMessages((prev) => prev.filter((m) => m._id !== msg._id));
    } finally {
      setTimeout(() => setIsSending(false), 300);
    }
  };

  const handleDeleteChat = () => {
    if (!currentChatuser?._id) return;
    Allchatdel(currentChatuser._id);
    setMessages([]);
    toast.success("Chat deleted");
    setShowMenu(false);
  };

  const isChatOpen = Boolean(currentChatuser?._id);

  return (
    <div data-theme={theme} className="h-[92vh] flex bg-base-200">
      <aside
        className={`w-full md:w-80 bg-base-100 border-r ${
          isChatOpen ? "hidden md:block" : "block"
        }`}
      >
        <People />
      </aside>

      <main
        className={`flex-1 flex flex-col ${
          isChatOpen ? "block" : "hidden md:flex"
        }`}
      >
        {isChatOpen ? (
          <>
           <header className="px-2 py-1 border-b border-base-300 flex items-center justify-between bg-base-100">
              <div className="flex items-center gap-3">
                <button 
                  className="btn btn-ghost btn-sm btn-circle md:hidden"
                  onClick={() => useAuthStore.setState({ currentChatuser: null })}
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="relative">
                  <div className="aspect-[1] h-14 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold">
                    {currentChatuser?.profile_pic ? (
                      <img
                        src={currentChatuser.profile_pic}
                        alt={currentChatuser.username}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span>{currentChatuser?.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  {isOnline(currentChatuser?._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-base-100" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-xl capitalize">{currentChatuser?.username}</h3>
                  <p className={`text-xs ${isOnline(currentChatuser?._id) ? "text-green-500" : "text-gray-400"}`}>
                    {isOnline(currentChatuser?._id) ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <button className="btn btn-ghost btn-sm btn-circle">
                  <Phone size={20} />
                </button>
                <button className="btn btn-ghost btn-sm btn-circle">
                  <Video size={20} />
                </button>
                
                <div className="relative">
                  <button 
                    className="btn btn-ghost btn-sm btn-circle"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-12 bg-base-100 shadow-lg rounded-lg w-48 border border-base-300 z-50">
                      <button 
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-base-200 text-error"
                        onClick={handleDeleteChat}
                      >
                        <Trash2 size={16} />
                        Delete Chat
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.length ? (
                messages.map((msg) => {
                  const mine = msg.sender === AuthUser?._id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${
                        mine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-2 rounded ${
                          mine
                            ? "bg-primary text-primary-content"
                            : "bg-base-100"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className="text-[10px] text-right opacity-60">
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-50">
                  <MessageCircle size={40} />
                  <p>No messages yet</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t flex gap-2">
              <input
                className="input input-bordered flex-1"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
              />
              <button
                className="btn btn-primary"
                onClick={handleSend}
                disabled={!newMessage.trim()}
              >
                <Send />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            Select a chat
          </div>
        )}
      </main>
    </div>
  );
};

export default Homepage;
