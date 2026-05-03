import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Hash, ArrowRight, Globe, Lock, Search, Copy, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

export default function StudyRoomPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myRooms, setMyRooms] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', subject_name: '', max_participants: 10 });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user?.id) { fetchMyRooms(); }
  }, [user?.id]);

  const fetchMyRooms = async () => {
    try { const { data } = await axios.get(`${API}/api/room/my-rooms?user_id=${user.id}`); setMyRooms(data); } catch (e) { console.error(e); }
  };

  const createRoom = async () => {
    try {
      const { data } = await axios.post(`${API}/api/room/create`, { ...form, host_id: user.id });
      setShowCreate(false);
      setForm({ name: '', description: '', subject_name: '', max_participants: 10 });
      fetchMyRooms();
      navigate(`/stms/student/room/${data.id}`);
    } catch (e) { setErrorMessage(e.response?.data?.detail || 'Lỗi tạo phòng'); }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    try {
      const { data } = await axios.post(`${API}/api/room/join/${joinCode.trim()}?user_id=${user.id}`);
      navigate(`/stms/student/room/${data.id}`);
    } catch (e) { setErrorMessage(e.response?.data?.detail || 'Mã phòng không hợp lệ'); }
  };

  const copyCode = (code, id) => {
    try {
      if (navigator && navigator.clipboard) {
        navigator.clipboard.writeText(code);
      } else {
        const el = document.createElement('textarea');
        el.value = code;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
    } catch (e) { console.error('Copy error:', e); }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Phòng Học</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Tạo phòng học nhóm, chia sẻ mã phòng cho bạn bè</p>
      </div>

      {/* Tạo phòng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Tạo phòng */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => setShowCreate(true)}>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <Plus size={28} />
          </div>
          <h3 className="text-xl font-bold mb-1">Tạo phòng mới</h3>
        </motion.div>

        {/* Tham gia phòng học */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Nhập mã phòng</h3>
          <div className="flex gap-2">
            <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              placeholder="123456" className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-mono font-bold tracking-wider focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none bg-white dark:bg-slate-700" />
            <button onClick={handleJoin} className="px-5 py-2.5 bg-slate-900 dark:bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-primary-700 transition-colors">
              Vào phòng
            </button>
          </div>
        </motion.div>
      </div>

      {/* Phòng của tôi */}
      {myRooms.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Users size={20} className="text-primary-500" /> Phòng của tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRooms.map((room, i) => (
              <motion.div key={room.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => navigate(`/stms/student/room/${room.id}`)}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{room.subject_name || 'Tổng hợp'}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); copyCode(room.room_code, room.id); }}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-mono font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    {copiedId === room.id ? <span className="text-emerald-500 text-[10px]">✓</span> : <Copy size={12} />}
                    {room.room_code}
                  </button>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">{room.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{room.current_participants}/{room.max_participants} thành viên • Host: {room.host_name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}


      {/* Tạo Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreate(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Tạo phòng học mới</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Tên phòng *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Nhập tên phòng" className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:border-primary-500 outline-none bg-white dark:bg-slate-700" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Môn học</label>
                <input value={form.subject_name} onChange={e => setForm({ ...form, subject_name: e.target.value })}
                  placeholder="Nhập môn học" className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:border-primary-500 outline-none bg-white dark:bg-slate-700" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Mô tả</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả..." rows={2} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-primary-500 outline-none resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700">Hủy</button>
              <button onClick={createRoom} disabled={!form.name.trim()}
                className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-bold text-sm hover:bg-primary-600 disabled:opacity-50 transition-colors">Tạo phòng</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Lỗi Modal */}
      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Đã có lỗi xảy ra</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage('')}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-xl transition-colors shadow-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
