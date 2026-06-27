import React, { useState } from "react";

interface LandingPageProps {
  initialRoomId?: string;
  onJoinRoom: (username: string, roomId: string) => void;
}

function LandingPage({ initialRoomId = "", onJoinRoom }: LandingPageProps) {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState(initialRoomId);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedRoomId = roomId.trim();

    if (!trimmedUsername) {
      alert("Please enter your username");
      return;
    }

    if (!trimmedRoomId) {
      alert("Please enter a room ID");
      return;
    }

    onJoinRoom(trimmedUsername, trimmedRoomId);
  };

  const handleCreate = () => {
    if (!username.trim()) return;
    const randomId = Math.random().toString(36).substring(2, 9);
    onJoinRoom(username.trim(), randomId);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Whiteboard
        </h1>
        <p className="text-center text-slate-300 mb-8 text-sm">
          Realtime Collaborative Whiteboard
        </p>

        <form onSubmit={handleJoin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-200">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 transition-all"
              required
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-200">
                Room ID
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter Room ID to join"
                className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 transition-all"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!username.trim() || !roomId.trim()}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold rounded-lg shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all text-center cursor-pointer"
              >
                Join Room
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!username.trim()}
                className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 font-semibold rounded-lg shadow-lg hover:shadow-slate-800/20 active:scale-95 transition-all text-center cursor-pointer"
              >
                Create Room
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LandingPage;
