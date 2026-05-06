import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, LogOut, ChevronDown, Timer, Play, Pause, Sun, Moon, Menu } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import axios from 'axios';
import socket from '../../lib/socket';
import { useNavigate } from 'react-router-dom';
import { usePomodoro } from '../../contexts/PomodoroContext';
import { useTheme } from '../../contexts/ThemeContext';

const API = import.meta.env.VITE_API_URL || '';

const Header = ({ onMenuToggle }) => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const profileRef = useRef(null);
    const navigate = useNavigate();

    const username = localStorage.getItem('username') || 'Người dùng';
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const [avatarUrl, setAvatarUrl] = useState('');

    const { minutes, seconds, isActive, mode, toggleTimer } = usePomodoro() || {};

    const { isDark, toggleTheme } = useTheme();

    // Kiểm tra trạng thái chưa đọc ban đầu + lấy dữ liệu người dùng
    useEffect(() => {
        const checkUnread = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API}/stms/notifications/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const unreadExists = response.data.some(n => !n.is_read);
                setHasUnread(unreadExists);
            } catch (err) {
                console.error('Error checking notifications', err);
            }
        };

        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API}/stms/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.avatar_url) {
                    setAvatarUrl(response.data.avatar_url);
                }
            } catch (err) {
                console.error('Error fetching user data for header', err);
            }
        };

        checkUnread();
        fetchUserData();

        // Cập nhật profile
        const handleAvatarUpdate = (e) => {
            if (e.detail && e.detail.avatar_url) {
                setAvatarUrl(e.detail.avatar_url);
            }
        };
        window.addEventListener('avatarUpdated', handleAvatarUpdate);

        return () => {
            window.removeEventListener('avatarUpdated', handleAvatarUpdate);
        };
    }, []);

    // Thông báo real-time qua global socket
    useEffect(() => {
        const unsub = socket.on('new_notification', (data) => {
            setHasUnread(true);
        });
        return () => { unsub(); };
    }, []);

    // Đóng dropdowns khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getRoleLabel = () => {
        if (roles.includes('admin')) return 'Quản trị viên';
        return 'Học sinh';
    };

    const handleProfileClick = () => {
        setIsProfileOpen(false);
        let path = '/stms/student/profile';
        if (roles.includes('admin')) path = '/stms/admin/profile';
        navigate(path);
    };

    const handleLogout = () => {
        socket.disconnect();
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        localStorage.removeItem('username');
        navigate('/stms/login');
    };

    return (
        <header className="h-16 md:h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 fixed top-0 right-0 left-0 md:left-64 z-30 flex items-center justify-between px-3 md:px-8 transition-colors">
            <div className="flex items-center gap-2">
                {/* Hamburger cho mobile */}
                <button 
                    onClick={onMenuToggle}
                    className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-600 dark:text-slate-400"
                >
                    <Menu size={22} />
                </button>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
                {/* Timer Pomodoro thu nhỏ */}
                {(isActive || (minutes !== undefined && minutes !== 25)) && (
                    <div
                        className="hidden md:flex items-center px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                        onClick={() => navigate('/stms/student/pomodoro')}
                        title=" Pomodoro"
                    >
                        <Timer className={`mr-2 ${mode === 'work' ? 'text-primary-500' : 'text-green-500'}`} size={16} />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 w-[42px] tabular-nums">
                            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </span>
                        <button
                            className="ml-2 p-1 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
                            onClick={(e) => { e.stopPropagation(); toggleTimer(); }}
                        >
                            {isActive ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                    </div>
                )}

                <div className="relative">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 md:p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all relative group"
                        title={isDark ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
                    >
                        <div className="relative w-5 h-5 md:w-[22px] md:h-[22px]">
                            <Sun
                                size={20}
                                className={`absolute inset-0 transform transition-all duration-500 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
                            />
                            <Moon
                                size={20}
                                className={`absolute inset-0 transform transition-all duration-500 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
                            />
                        </div>
                    </button>
                </div>

                <div className="relative">
                    <button
                        onClick={() => {
                            setIsNotificationsOpen(!isNotificationsOpen);
                            if (!isNotificationsOpen) {
                                setHasUnread(false);
                            }
                        }}
                        className={`cursor-pointer p-2 rounded-xl transition-all ${isNotificationsOpen ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                    >
                        <Bell size={20} />
                        {hasUnread && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        )}
                    </button>
                    <NotificationCenter
                        isOpen={isNotificationsOpen}
                        onClose={() => setIsNotificationsOpen(false)}
                    />
                </div>

                <div className="relative border-l pl-2 md:pl-4 border-slate-200 dark:border-slate-700" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 md:space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-1 md:p-1.5 rounded-xl transition-all"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{username}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{getRoleLabel()}</p>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                            <img
                                src={avatarUrl || `https://ui-avatars.com/api/?name=${username}&background=0ea5e9&color=fff`}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform hidden md:block ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Hồ sơ*/}
                    {isProfileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-1 sm:hidden">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{username}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{getRoleLabel()}</p>
                            </div>

                            <button
                                onClick={handleProfileClick}
                                className="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                <User size={16} className="mr-3" />
                                Hồ sơ của tôi
                            </button>

                            <div className="my-1 border-t border-slate-100 dark:border-slate-700"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <LogOut size={16} className="mr-3" />
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
