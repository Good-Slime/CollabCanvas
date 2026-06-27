import { useState } from "react";

interface NavbarProps {
  roomId: string;
  isConnected: boolean;
  activeUsersCount: number;
  onLeaveRoom: () => void;
}

function Navbar({ roomId, isConnected, activeUsersCount, onLeaveRoom }: NavbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-6 py-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-lg text-white">
      <div className="flex items-center gap-3">
        <h1
          onClick={onLeaveRoom}
          className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent cursor-pointer select-none"
        >
          Whiteboard
        </h1>
        <span className="h-4 w-px bg-slate-700"></span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Room:</span>
          <code className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-blue-300">
            {roomId}
          </code>
          <button
            onClick={handleCopyLink}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white active:scale-95 transition-all cursor-pointer"
            title="Copy room link"
          >
            {copied ? (
              <span className="text-xs text-green-400 font-semibold px-1">Copied!</span>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? "bg-green-400" : "bg-red-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
          </span>
          <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>{activeUsersCount} online</span>
        </div>

        <button
          onClick={onLeaveRoom}
          className="px-3 py-1 text-xs font-semibold text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
        >
          Leave
        </button>
      </div>
    </header>
  );
}

export default Navbar;
