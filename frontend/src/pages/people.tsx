import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../store/authStore";

// Initialize socket connection
const socket: Socket = io("http://localhost:3000", { 
  withCredentials: true,
  transports: ["websocket", "polling"]
});

const People: React.FC = () => {
  const { getmsg, getpeople, messageUser, AuthUser } = useAuthStore();
  const [search, setSearch] = useState<string>("");
  const [people, setPeople] = useState<typeof messageUser>([]);
  const [filtered, setFiltered] = useState<typeof messageUser>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!AuthUser?._id) return;

    // Join the socket with user ID
    socket.emit("join", AuthUser._id);

    // Listen for online users updates
    socket.on("onlineUsers", (data: string[]) => {
      setOnlineUsers(data);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, [AuthUser]);

  useEffect(() => {
    const fetchPeople = async () => {
      await getpeople();
    };
    fetchPeople();
  }, [getpeople]);

  useEffect(() => {
    setPeople(messageUser || []);
  }, [messageUser]);

  useEffect(() => {
    let result = [...people];

    if (search.trim()) {
      result = result.filter((p) =>
        p.username.toLowerCase().includes(search.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const isAOnline = onlineUsers.includes(a._id);
      const isBOnline = onlineUsers.includes(b._id);

      if (isAOnline && !isBOnline) return -1; 
      if (!isAOnline && isBOnline) return 1;  
      return 0; 
    });

    setFiltered(result);
  }, [search, people, onlineUsers]);

  const isOnline = (id: string) => onlineUsers.includes(id);

  return (
    <div className="h-[90vh] flex flex-col bg-inherit border-r border-base-300">
      <div className="bg-base-100 border-b border-base-300 py-3 px-4">
        <h1 className="text-xl font-semibold text-base-content">Chats</h1>
      </div>

      <div className="p-3">
        <input
          type="text"
          placeholder="🔍 Start a new chat..."
          className="input input-bordered w-full input-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-y-auto flex-1">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item._id}
              onClick={() => getmsg(item._id)}
              className="flex items-center gap-3 p-3 cursor-pointer 
             bg-inherit text-base-content hover:bg-secondary hover:text-secondary-content 
             transition-colors"
            >
              <div className="relative">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full aspect-[1] h-12 flex items-center justify-center overflow-hidden">
                    {item.profile_pic ? (
                      <img
                        src={item.profile_pic}
                        alt={item.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{item.username.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                </div>
                
                {isOnline(item._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-base-100 shadow-sm"></span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="capitalize font-semibold">{item.username}</p>
                </div>
                <p className="text-sm opacity-70 truncate">
                  {isOnline(item._id) ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-base-content/70 py-5">
            No matches found 😢
          </p>
        )}
      </div>
    </div>
  );
};

export default People;