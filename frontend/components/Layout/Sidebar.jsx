import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Calendar,
    BookOpen,
    Timer,
    LineChart,
    Settings,
    Bell,
    LogOut,
    Activity
} from 'lucide-react';

const Sidebar = () => {
    const userRoles = JSON.parse(localStorage.getItem('roles') || '[]');

    const studentItems = [
        { icon: LayoutDashboard, label: 'Tổng quan', path: '/stms/student' },
        { icon: CheckSquare, label: 'Nhiệm vụ', path: '/stms/student/tasks' },
        { icon: Calendar, label: 'Lịch học', path: '/stms/student/schedule' },
        { icon: BookOpen, label: 'Môn học', path: '/stms/student/subjects' },
        { icon: Timer, label: 'Pomodoro', path: '/stms/student/pomodoro' },
        { icon: LineChart, label: 'Báo cáo', path: '/stms/student/reports' },
    ];

    const parentItems = [
        { icon: LayoutDashboard, label: 'Giám sát con', path: '/stms/parent' },
        { icon: LineChart, label: 'Báo cáo tổng hợp', path: '/stms/parent/reports' },
        { icon: Bell, label: 'Thông báo', path: '/stms/parent/notifications' },
    ];

    const adminItems = [
        { icon: LayoutDashboard, label: 'Admin Hub', path: '/stms/admin' },
        { icon: Settings, label: 'Cấu hình hệ thống', path: '/stms/admin/settings' },
        { icon: Activity, label: 'Activity Logs', path: '/stms/admin/logs' },
    ];

    let menuItems = studentItems;
    if (userRoles.includes('admin')) menuItems = adminItems;
    else if (userRoles.includes('parent')) menuItems = parentItems;

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/stms/login';
    };

    return (
        <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <div className="flex items-center space-x-3 text-primary-600">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
                        <BookOpen size={24} />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">EduFlow</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/stms/student' || item.path === '/stms/parent' || item.path === '/stms/admin'}
                        className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group
              ${isActive
                                ? 'bg-primary-50 text-primary-600 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
            `}
                    >
                        <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all group"
                >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
