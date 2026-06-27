# CollabCanvas 🎨

A sleek, modern, real-time collaborative whiteboard application that allows multiple users to draw, erase, and interact in shared rooms simultaneously.

---

## 🚀 Features

- **Real-Time Collaboration**: Real-time canvas synchronization and user cursor tracking across rooms via WebSockets.
- **Rich Toolbar Controls**:
  - **Drawing & Erasing**: Toggle between a precision Pencil tool and an Eraser tool.
  - **Stroke Width**: Adjustable brush size slider ranging from 1px to 50px.
  - **Color Palette**: Choose from a preset grid of colors or pick any custom hue using the built-in HTML5 color picker.
- **Canvas State Management**:
  - **Undo / Redo**: Easily step backward or forward through your actions.
  - **Clear Canvas**: Reset the whiteboard clean.
  - **Download PNG**: Export your whiteboard creation directly to your local machine.
- **Graceful Persistence**:
  - Automatically connects to **MongoDB** to persist room states.
  - Fallbacks seamlessly to a robust **in-memory data store** if MongoDB is unavailable, ensuring zero downtime.
- **Premium User Interface**: Modern UI styled with **TailwindCSS v4** featuring responsive controls, dark-mode styling, and smooth glassmorphism effects.

---

## 🛠️ Tech Stack

### Frontend
- **React 19**
- **Vite**
- **TailwindCSS v4**
- **TypeScript**
- **Socket.io Client**

### Backend
- **Node.js** & **Express**
- **Socket.io**
- **TypeScript**
- **MongoDB** & **Mongoose**

---

## 📂 Project Structure

```text
Whiteboard-Clean/
├── backend/
│   ├── src/
│   │   ├── models/        # Mongoose schema definitions
│   │   ├── types/         # TypeScript type files
│   │   └── index.ts       # Express server and Socket.io event logic
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Canvas, Toolbar, LandingPage, Cursors, etc.
│   │   ├── sockets/       # Socket.io connection setup
│   │   ├── utils/         # Helper functions
│   │   ├── App.tsx        # Main application component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended). Optionally, have a local [MongoDB](https://www.mongodb.com/) instance running on its default port (`27017`).

### 1. Setup the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The server will start on [http://localhost:3000](http://localhost:3000).

### 2. Setup the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Click the link in your terminal (usually [http://localhost:5173](http://localhost:5173)) to open the application in your browser.

---

## 📝 License

This project is licensed under the **ISC License**. See the `backend/package.json` for details.
