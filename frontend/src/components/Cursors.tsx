import type { User } from "../types/draw";

interface CursorsProps {
  users: User[];
}

function Cursors({ users }: CursorsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {users.map((u) => {
        if (u.x === undefined || u.y === undefined) return null;
        const left = u.x * window.innerWidth;
        const top = u.y * window.innerHeight;

        return (
          <div
            key={u.socketId}
            className="absolute transition-all duration-75 ease-out"
            style={{
              left: `${left}px`,
              top: `${top}px`,
            }}
          >
            <svg
              className="w-5 h-5 drop-shadow-md"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
            >
              <path
                d="M3 3l7.07 16.97 2.51-6.75 6.75-2.51L3 3z"
                fill={u.color}
              />
            </svg>
            <div
              className="ml-4 mt-1 px-2 py-0.5 rounded text-xs font-semibold text-white whitespace-nowrap shadow-md"
              style={{ backgroundColor: u.color }}
            >
              {u.username}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Cursors;
