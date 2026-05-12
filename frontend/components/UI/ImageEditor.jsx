import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, Pen, Circle, Square, Type, Undo2, Redo2, Send, Eraser, Minus, Plus, Palette } from 'lucide-react';

/**
 * ImageEditor - Chỉnh sửa/khoanh vùng ảnh trước khi gửi (giống Messenger)
 * Props:
 *   - imageFile: File object (ảnh được chọn)
 *   - onSend: (editedBlob, caption) => void
 *   - onClose: () => void
 */
const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#f97316', '#a855f7', '#ec4899', '#ffffff', '#000000'];
const TOOLS = [
  { id: 'pen', icon: Pen, label: 'Bút vẽ' },
  { id: 'circle', icon: Circle, label: 'Vòng tròn' },
  { id: 'rect', icon: Square, label: 'Hình chữ nhật' },
  { id: 'line', icon: Minus, label: 'Đường thẳng' },
  { id: 'text', icon: Type, label: 'Chữ' },
  { id: 'eraser', icon: Eraser, label: 'Tẩy' },
];

export default function ImageEditor({ imageFile, onSend, onClose }) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [img, setImg] = useState(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#ef4444');
  const [lineWidth, setLineWidth] = useState(3);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [caption, setCaption] = useState('');
  const [textInput, setTextInput] = useState('');
  const [textPos, setTextPos] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ w: 600, h: 400 });

  // Load ảnh gốc
  useEffect(() => {
    if (!imageFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        // Tính kích thước canvas phù hợp (max 700px width)
        const maxW = Math.min(700, window.innerWidth - 100);
        const ratio = image.width / image.height;
        let w = Math.min(image.width, maxW);
        let h = w / ratio;
        if (h > 500) { h = 500; w = h * ratio; }
        setCanvasSize({ w: Math.round(w), h: Math.round(h) });
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  // Vẽ ảnh gốc lên canvas khi load xong
  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = canvasSize.w;
    canvasRef.current.height = canvasSize.h;
    ctx.drawImage(img, 0, 0, canvasSize.w, canvasSize.h);
    // Lưu state đầu tiên
    const initial = ctx.getImageData(0, 0, canvasSize.w, canvasSize.h);
    setHistory([initial]);
    setHistoryIdx(0);

    // Setup overlay
    if (overlayRef.current) {
      overlayRef.current.width = canvasSize.w;
      overlayRef.current.height = canvasSize.h;
    }
  }, [img, canvasSize]);

  const saveState = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const state = ctx.getImageData(0, 0, canvasSize.w, canvasSize.h);
    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(state);
    if (newHistory.length > 30) newHistory.shift(); // Giới hạn 30 bước
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
  }, [history, historyIdx, canvasSize]);

  const undo = () => {
    if (historyIdx <= 0) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.putImageData(history[historyIdx - 1], 0, 0);
    setHistoryIdx(historyIdx - 1);
  };

  const redo = () => {
    if (historyIdx >= history.length - 1) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.putImageData(history[historyIdx + 1], 0, 0);
    setHistoryIdx(historyIdx + 1);
  };

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    if (tool === 'text') {
      setTextPos(getPos(e));
      return;
    }
    setDrawing(true);
    setStartPos(getPos(e));
    if (tool === 'pen' || tool === 'eraser') {
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
      const pos = getPos(e);
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const handlePointerMove = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const pos = getPos(e);

    if (tool === 'pen' || tool === 'eraser') {
      const ctx = canvasRef.current.getContext('2d');
      ctx.lineWidth = tool === 'eraser' ? lineWidth * 4 : lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      // Vẽ preview trên overlay cho shape tools
      const ovCtx = overlayRef.current.getContext('2d');
      ovCtx.clearRect(0, 0, canvasSize.w, canvasSize.h);
      ovCtx.strokeStyle = color;
      ovCtx.lineWidth = lineWidth;
      ovCtx.lineCap = 'round';

      if (tool === 'circle') {
        const rx = Math.abs(pos.x - startPos.x) / 2;
        const ry = Math.abs(pos.y - startPos.y) / 2;
        const cx = (pos.x + startPos.x) / 2;
        const cy = (pos.y + startPos.y) / 2;
        ovCtx.beginPath();
        ovCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ovCtx.stroke();
      } else if (tool === 'rect') {
        ovCtx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === 'line') {
        ovCtx.beginPath();
        ovCtx.moveTo(startPos.x, startPos.y);
        ovCtx.lineTo(pos.x, pos.y);
        ovCtx.stroke();
      }
    }
  };

  const handlePointerUp = (e) => {
    if (!drawing) return;
    setDrawing(false);

    if (tool === 'pen' || tool === 'eraser') {
      const ctx = canvasRef.current.getContext('2d');
      ctx.globalCompositeOperation = 'source-over';
      saveState();
    } else {
      // Commit shape từ overlay sang canvas chính
      const pos = e.changedTouches ? { x: e.changedTouches[0].clientX - canvasRef.current.getBoundingClientRect().left, y: e.changedTouches[0].clientY - canvasRef.current.getBoundingClientRect().top } : getPos(e);
      const ctx = canvasRef.current.getContext('2d');
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';

      if (tool === 'circle') {
        const rx = Math.abs(pos.x - startPos.x) / 2;
        const ry = Math.abs(pos.y - startPos.y) / 2;
        const cx = (pos.x + startPos.x) / 2;
        const cy = (pos.y + startPos.y) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
      // Xóa overlay
      const ovCtx = overlayRef.current.getContext('2d');
      ovCtx.clearRect(0, 0, canvasSize.w, canvasSize.h);
      saveState();
    }
  };

  const addText = () => {
    if (!textInput.trim() || !textPos) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.font = `bold ${lineWidth * 6 + 12}px sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(textInput, textPos.x, textPos.y);
    setTextInput('');
    setTextPos(null);
    saveState();
  };

  const handleSend = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) onSend(blob, caption);
    }, 'image/png');
  };

  if (!imageFile) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-[800px] w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-base font-black text-slate-800 dark:text-white">Chỉnh sửa ảnh</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex-wrap">
          {/* Tool buttons */}
          {TOOLS.map(t => (
            <button key={t.id} onClick={() => setTool(t.id)} title={t.label}
              className={`p-2 rounded-lg transition-all ${tool === t.id ? 'bg-primary-500 text-white shadow-md shadow-primary-200' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
              <t.icon size={18} />
            </button>
          ))}

          <div className="w-px h-7 bg-slate-300 dark:bg-slate-600 mx-1" />

          {/* Color picker */}
          <div className="relative">
            <button onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-7 h-7 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: color }} />
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-2 flex gap-1.5 z-10 border border-slate-200 dark:border-slate-700">
                {COLORS.map(c => (
                  <button key={c} onClick={() => { setColor(c); setShowColorPicker(false); }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${c === color ? 'border-primary-500 scale-110' : 'border-slate-300 dark:border-slate-600'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-7 bg-slate-300 dark:bg-slate-600 mx-1" />

          {/* Line width */}
          <div className="flex items-center gap-1">
            <button onClick={() => setLineWidth(Math.max(1, lineWidth - 1))} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <Minus size={14} />
            </button>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-5 text-center">{lineWidth}</span>
            <button onClick={() => setLineWidth(Math.min(12, lineWidth + 1))} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <Plus size={14} />
            </button>
          </div>

          <div className="w-px h-7 bg-slate-300 dark:bg-slate-600 mx-1" />

          {/* Undo/Redo */}
          <button onClick={undo} disabled={historyIdx <= 0} title="Hoàn tác"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-all">
            <Undo2 size={18} />
          </button>
          <button onClick={redo} disabled={historyIdx >= history.length - 1} title="Làm lại"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-all">
            <Redo2 size={18} />
          </button>
        </div>

        {/* Canvas area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 min-h-0">
          <div className="relative" style={{ width: canvasSize.w, height: canvasSize.h }}>
            <canvas ref={canvasRef} className="absolute top-0 left-0 rounded-lg shadow-lg cursor-crosshair"
              style={{ width: canvasSize.w, height: canvasSize.h }}
              onMouseDown={handlePointerDown} onMouseMove={handlePointerMove} onMouseUp={handlePointerUp} onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown} onTouchMove={handlePointerMove} onTouchEnd={handlePointerUp} />
            <canvas ref={overlayRef} className="absolute top-0 left-0 pointer-events-none rounded-lg"
              style={{ width: canvasSize.w, height: canvasSize.h }} />
            
            {/* Text input popup */}
            {textPos && tool === 'text' && (
              <div className="absolute z-10 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-2 border border-slate-200 dark:border-slate-700 flex gap-1.5"
                style={{ left: textPos.x, top: textPos.y }}>
                <input value={textInput} onChange={e => setTextInput(e.target.value)} autoFocus
                  onKeyDown={e => e.key === 'Enter' && addText()}
                  placeholder="Nhập chữ..." className="bg-transparent outline-none text-sm w-32 text-slate-800 dark:text-white" />
                <button onClick={addText} className="px-2 py-1 bg-primary-500 text-white rounded-lg text-xs font-bold">OK</button>
                <button onClick={() => setTextPos(null)} className="px-1 py-1 text-slate-400 hover:text-red-500"><X size={14} /></button>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Caption + Send */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <input value={caption} onChange={e => setCaption(e.target.value)}
            placeholder="Thêm chú thích..."
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-xl text-sm outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400" />
          <button onClick={handleSend}
            className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-md shadow-primary-200 transition-colors">
            <Send size={16} /> Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
