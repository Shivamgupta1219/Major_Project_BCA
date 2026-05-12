const ZoomControls = ({ zoom, setZoom }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setZoom((z) => Math.max(z - 0.1, 0.7))}
        className="px-2 border rounded"
      >
        −
      </button>
      <span className="text-sm">{Math.round(zoom * 100)}%</span>
      <button
        onClick={() => setZoom((z) => Math.min(z + 0.1, 1.5))}
        className="px-2 border rounded"
      >
        +
      </button>
    </div>
  );
};

export default ZoomControls;
