import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Inbox, Info, AlertTriangle, Users, UserPlus, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import socket from '../../lib/socket';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const NotificationCenter = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy thông báo 
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    // Thông báo real-time
    useEffect(() => {
        const unsub = socket.on('new_notification', (data) => {
            const notifData = data.data || data;
            setNotifications(prev => [notifData, ...prev]);
        });
        return () => { unsub(); };
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API}/stms/notifications/`, {
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
            await axios.put(`${API}/stms/notifications/${id}/read`, {}, {
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
            await axios.put(`${API}/stms/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error('Error marking all read', err);
        }
    };

    const deleteNotification = async (id, e) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API}/stms/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (err) {
            console.error('Error deleting notification', err);
        }
    };

    const getTypeStyles = (type) => {
        switch (type) {
            case 'alert': return 'bg-red-100 text-red-600';
            case 'warning': return 'bg-amber-100 text-amber-600';
            case 'join_request': return 'bg-purple-100 text-purple-600';
            case 'community': return 'bg-emerald-100 text-emerald-600';
            case 'community_message': return 'bg-blue-100 text-blue-600';
            case 'buddy_request': return 'bg-indigo-100 text-indigo-600';
            case 'buddy_accepted': return 'bg-green-100 text-green-600';
            case 'direct_message': return 'bg-cyan-100 text-cyan-600';
            default: return 'bg-blue-100 text-blue-600';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'alert': return <AlertTriangle size={16} />;
            case 'warning': return <Info size={16} />;
            case 'join_request': return <UserPlus size={16} />;
            case 'community': return <Users size={16} />;
            case 'community_message': return <MessageSquare size={16} />;
            case 'buddy_request': return <UserPlus size={16} />;
            case 'buddy_accepted': return <Check size={16} />;
            case 'direct_message': return <MessageSquare size={16} />;
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
                        className="absolute top-20 right-8 w-96 bg-white dark:bg-slate-800 dark:text-white rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden flex flex-col max-h-[600px]"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Thông báo</h3>
                                {notifications.filter(n => !n.is_read).length > 0 && (
                                    <span className="bg-primary-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                        {notifications.filter(n => !n.is_read).length} Mới
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={markAllRead}
                                    className="p-2 text-slate-400 hover:text-primary-500 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"
                                    title="Đánh dấu tất cả đã đọc"
                                >
                                    <Check size={18} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"
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
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto text-slate-200 dark:text-slate-500">
                                        <Inbox size={32} />
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium">Bạn không có thông báo nào.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50 dark:divide-slate-700">
                                    {notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => {
                                                if (!n.is_read) markAsRead(n.id);
                                                if (n.link_url) {
                                                    navigate(n.link_url);
                                                    onClose();
                                                }
                                            }}
                                            className={`p-5 flex space-x-4 transition-all cursor-pointer group relative ${n.is_read ? 'opacity-60' : 'bg-primary-50/30 dark:bg-primary-900/20 hover:bg-primary-50 dark:hover:bg-primary-900/30'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${getTypeStyles(n.notification_type || n.type)}`}>
                                                {getTypeIcon(n.notification_type || n.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate pr-2">{n.title}</p>
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        {!n.is_read && <div className="w-2 h-2 bg-primary-500 rounded-full" />}
                                                        <button
                                                            onClick={(e) => deleteNotification(n.id, e)}
                                                            className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                            title="Xóa thông báo"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{n.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                                    {new Date(n.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(n.created_at).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs font-bold hover:text-primary-600 dark:hover:text-primary-400 transition-all border-t border-slate-100 dark:border-slate-700">
                            XEM TẤT CẢ THÔNG BÁO
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationCenter;
