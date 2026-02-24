import React, { useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const Header = () => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const username = localStorage.getItem('username') || 'Người dùng';
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');

    const getRoleLabel = () => {
        if (roles.includes('admin')) return 'Quản trị viên';
        if (roles.includes('parent')) return 'Phụ huynh';
        return 'Học sinh';
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-8">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
            </div>

            <div className="flex items-center space-x-6">
                <div className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={`cursor-pointer p-2 rounded-xl transition-all ${isNotificationsOpen ? 'bg-primary-50 text-primary-600' : 'hover:bg-slate-100 text-slate-600'}`}
                    >
                        <Bell size={22} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <NotificationCenter
                        isOpen={isNotificationsOpen}
                        onClose={() => setIsNotificationsOpen(false)}
                    />
                </div>

                <div className="flex items-center space-x-3 border-l pl-6 border-slate-200">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{username}</p>
                        <p className="text-xs text-slate-500">{getRoleLabel()}</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                        <img
                            src={`https://ui-avatars.com/api/?name=${username}&background=0ea5e9&color=fff`}
                            alt="avatar"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
