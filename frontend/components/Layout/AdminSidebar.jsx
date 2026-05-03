import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, Settings, Activity, Users, LogOut } from 'lucide-react';

const AdminSidebar = () => {
    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_roles');
        localStorage.removeItem('admin_username');
        window.location.href = '/stms/admin/login';
    };

    const adminItems = [
        { icon: LayoutDashboard, label: 'Bảng điều khiển', path: '/stms/admin' },
        { icon: Activity, label: 'Giám sát hệ thống', path: '/stms/admin/logs' },
        { icon: Settings, label: 'Cấu hình Server', path: '/stms/admin/settings' },
    ];

    return (
        <div className="w-64 bg-slate-950 border-r border-slate-800 h-screen flex flex-col fixed left-0 top-0 text-slate-300">
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center space-x-3 text-red-500">
                    <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center text-red-500 shadow-[0_0_15px_-3px_rgba(239,68,68,0.4)]">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight leading-tight">EduFlow</h1>
                        <p className="text-[10px] uppercase tracking-widest text-red-500 font-bold">Admin</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {adminItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/stms/admin'}
                        className={({ isActive }) => `
                            flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group font-medium
                            ${isActive
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent'}
                        `}
                    >
                        <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

        </div>
    );
};

export default AdminSidebar;
