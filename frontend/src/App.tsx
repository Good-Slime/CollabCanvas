import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage";
import Canvas from "./components/Canvas";
import "./App.css";

function App() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("whiteboard_username") || "";
  });
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const handlePopState = () => {
      const match = window.location.pathname.match(/^\/room\/([^/]+)/);
      if (match) {
        setRoomId(match[1]);
      } else {
        setRoomId("");
      }
    };

    window.addEventListener("popstate", handlePopState);
    handlePopState();

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleJoinRoom = (enteredUsername: string, enteredRoomId: string) => {
    localStorage.setItem("whiteboard_username", enteredUsername);
    setUsername(enteredUsername);
    setRoomId(enteredRoomId);
    window.history.pushState(null, "", `/room/${enteredRoomId}`);
  };

  const handleLeaveRoom = () => {
    setRoomId("");
    window.history.pushState(null, "", "/");
  };

  if (roomId && username) {
    return (
      <Canvas
        roomId={roomId}
        username={username}
        onLeaveRoom={handleLeaveRoom}
      />
    );
  }

  return (
    <LandingPage
      initialRoomId={roomId}
      onJoinRoom={handleJoinRoom}
    />
  );
}

export default App;
