import React, { useState } from 'react';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';
import { useToast } from '../../components/UI/Toast';

const AdminHeader = () => {
    const adminUsername = localStorage.getItem('admin_username') || 'Administrator';
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const addToast = useToast();

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_roles');
        localStorage.removeItem('admin_username');
        window.location.href = '/stms/admin/login';
    };

    return (
        <header className="fixed top-0 right-0 left-64 h-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-40">
            {/* Thanh tìm kiếm */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm logs, người dùng, cấu hình..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center space-x-6 relative">
                <button onClick={() => addToast('Không có thông báo', 'info')} className="relative text-slate-400 hover:text-white transition-colors">
                    <Bell size={22} />
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-slate-950">0</span>
                </button>

                <div className="h-8 w-px bg-slate-800"></div>

                <div
                    className="flex items-center space-x-3 cursor-pointer hover:bg-slate-900 py-1.5 px-3 rounded-xl transition-colors relative"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                    <div className="text-right">
                        <p className="text-sm font-bold text-white leading-tight">{adminUsername}</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 text-slate-400">
                        <UserCircle size={24} />
                    </div>

                    {showProfileMenu && (
                        <div className="absolute top-14 right-0 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                            <div
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-800 cursor-pointer"
                            >
                                <LogOut size={16} className="mr-2" />
                                Đăng xuất
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
