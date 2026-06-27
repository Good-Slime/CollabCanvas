
interface ToolbarProps {
  tool: "pencil" | "eraser";
  setTool: (tool: "pencil" | "eraser") => void;
  color: string;
  setColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (size: number) => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDownload: () => void;
}

function Toolbar({
  tool,
  setTool,
  color,
  setColor,
  lineWidth,
  setLineWidth,
  onClear,
  onUndo,
  onRedo,
  onDownload,
}: ToolbarProps) {
  const colors = ["#000000", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col md:flex-row items-center gap-4 px-6 py-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/50 shadow-2xl text-white max-w-full overflow-x-auto">
      <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
        <button
          onClick={() => setTool("pencil")}
          className={`p-2.5 rounded-lg transition-all active:scale-95 cursor-pointer ${
            tool === "pencil" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
          }`}
          title="Pencil"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>

        <button
          onClick={() => setTool("eraser")}
          className={`p-2.5 rounded-lg transition-all active:scale-95 cursor-pointer ${
            tool === "eraser" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
          }`}
          title="Eraser"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>

      <span className="hidden md:inline-block h-6 w-px bg-slate-700"></span>

      {tool === "pencil" && (
        <div className="flex items-center gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 transition-all active:scale-90 cursor-pointer ${
                color === c ? "border-white scale-110" : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-7 h-7 rounded border border-slate-600 bg-transparent p-0 cursor-pointer"
            title="Custom Color"
          />
        </div>
      )}

      <span className="hidden md:inline-block h-6 w-px bg-slate-700"></span>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 font-medium select-none">Size</span>
        <input
          type="range"
          min="1"
          max="50"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="w-24 accent-blue-500 cursor-pointer"
        />
        <span className="text-xs font-mono text-slate-300 w-5 text-right select-none">
          {lineWidth}px
        </span>
      </div>

      <span className="hidden md:inline-block h-6 w-px bg-slate-700"></span>

      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white active:scale-95 transition-all cursor-pointer"
          title="Undo"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>

        <button
          onClick={onRedo}
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white active:scale-95 transition-all cursor-pointer"
          title="Redo"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
          </svg>
        </button>

        <button
          onClick={onClear}
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-red-400 hover:text-red-300 hover:bg-red-500/10 active:scale-95 transition-all cursor-pointer"
          title="Clear Board"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <button
          onClick={onDownload}
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white active:scale-95 transition-all cursor-pointer"
          title="Download PNG"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
