import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Minimize2, Maximize2, Monitor } from 'lucide-react';
import { useVideoCall } from '@/contexts/VideoCallContext';

export default function FloatingVideoCall() {
  const { callState, remoteUsername, localStream, remoteStream, endCall, toggleMute, toggleCamera } = useVideoCall();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [minimized, setMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  useEffect(() => {
    if (localVideoRef.current && localStream.current) {
      localVideoRef.current.srcObject = localStream.current;
    }
  }, [callState, localStream.current]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream.current) {
      remoteVideoRef.current.srcObject = remoteStream.current;
    }
  }, [callState, remoteStream.current]);

  if (callState === 'idle') return null;

  const handleMute = () => { toggleMute(); setIsMuted(!isMuted); };
  const handleCamera = () => { toggleCamera(); setIsCamOff(!isCamOff); };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 100 }}
        drag dragConstraints={{ left: -500, right: 500, top: -300, bottom: 300 }}
        className={`fixed z-[9999] shadow-2xl rounded-3xl overflow-hidden bg-slate-900
          ${minimized ? 'bottom-6 right-6 w-64 h-48' : 'bottom-6 right-6 w-[480px] h-[380px]'}`}
        style={{ cursor: 'grab' }}
      >
        {/* Video từ xa */}
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />

        {/* Lớp phủ khi gọi */}
        {callState === 'calling' && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4 animate-pulse">
              <Phone size={32} className="text-white" />
            </div>
            <p className="text-white font-bold text-lg">Đang gọi...</p>
            <p className="text-white/70 text-sm mt-1">{remoteUsername}</p>
          </div>
        )}

        {/* Video local (PiP) */}
        {!minimized && (
          <div className="absolute top-4 right-4 w-32 h-24 bg-slate-800 rounded-xl overflow-hidden shadow-lg border-2 border-white/20">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          </div>
        )}

        {/* Điều khiển */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-center gap-3">
            <button onClick={handleMute}
              className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'}`}>
              {isMuted ? <MicOff size={18} className="text-white" /> : <Mic size={18} className="text-white" />}
            </button>
            <button onClick={handleCamera}
              className={`p-3 rounded-full transition-colors ${isCamOff ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'}`}>
              {isCamOff ? <VideoOff size={18} className="text-white" /> : <Video size={18} className="text-white" />}
            </button>
            <button onClick={endCall} className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors">
              <PhoneOff size={18} className="text-white" />
            </button>
            <button onClick={() => setMinimized(!minimized)}
              className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              {minimized ? <Maximize2 size={18} className="text-white" /> : <Minimize2 size={18} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Header */}
        {minimized && (
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="text-white text-sm font-bold truncate">{remoteUsername}</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
