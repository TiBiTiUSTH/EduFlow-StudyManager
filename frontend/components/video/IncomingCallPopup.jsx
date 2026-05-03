import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { useVideoCall } from '@/contexts/VideoCallContext';

export default function IncomingCallPopup() {
  const { callState, remoteUsername, acceptCall, endCall } = useVideoCall();

  if (callState !== 'ringing') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999]"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 px-8 py-6 w-80">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center animate-pulse">
              <Video size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Cuộc gọi đến</p>
              <p className="text-lg font-black text-slate-900">{remoteUsername || 'Study Buddy'}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={endCall}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors">
              <PhoneOff size={18} /> Từ chối
            </button>
            <button onClick={() => acceptCall()}
              className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors">
              <Phone size={18} /> Nghe
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
