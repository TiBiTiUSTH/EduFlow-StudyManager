import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Inbox, Info, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const NotificationCenter = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/stms/notifications/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
        } catch (err) {
            console.error('Error fetching notifications', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/stms/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error('Error marking as read', err);
        }
    };

    const markAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8000/stms/notifications/read-all', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error('Error marking all read', err);
        }
    };

    const getTypeStyles = (type) => {
        switch (type) {
            case 'alert': return 'bg-red-100 text-red-600';
            case 'warning': return 'bg-amber-100 text-amber-600';
            default: return 'bg-blue-100 text-blue-600';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'alert': return <AlertTriangle size={16} />;
            case 'warning': return <Info size={16} />;
            default: return <Bell size={16} />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-20 right-8 w-96 bg-white rounded-[32px] shadow-2xl border border-slate-100 z-50 overflow-hidden flex flex-col max-h-[600px]"
                    >
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-slate-900 text-lg">Thông báo</h3>
                                {notifications.filter(n => !n.is_read).length > 0 && (
                                    <span className="bg-primary-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                        {notifications.filter(n => !n.is_read).length} Mới
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={markAllRead}
                                    className="p-2 text-slate-400 hover:text-primary-500 hover:bg-white rounded-xl transition-all"
                                    title="Đánh dấu tất cả đã đọc"
                                >
                                    <Check size={18} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="p-12 text-center text-slate-400 italic">Đang tải...</div>
                            ) : notifications.length === 0 ? (
                                <div className="p-16 text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                        <Inbox size={32} />
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium">Bạn không có thông báo nào.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => !n.is_read && markAsRead(n.id)}
                                            className={`p-5 flex space-x-4 transition-all cursor-pointer group ${n.is_read ? 'opacity-60' : 'bg-primary-50/30 hover:bg-primary-50'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${getTypeStyles(n.notification_type)}`}>
                                                {getTypeIcon(n.notification_type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <p className="text-sm font-bold text-slate-900 truncate pr-2">{n.title}</p>
                                                    {!n.is_read && <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />}
                                                </div>
                                                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{n.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                                    {new Date(n.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(n.created_at).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="p-4 bg-slate-50 text-slate-500 text-xs font-bold hover:text-primary-600 transition-all border-t border-slate-100">
                            XEM TẤT CẢ THÔNG BÁO
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationCenter;
