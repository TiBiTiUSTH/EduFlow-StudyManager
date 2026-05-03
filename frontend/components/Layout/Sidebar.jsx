import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Calendar,
    BookOpen,
    Timer,
    Settings,
    Bell,
    LogOut,
    Activity,
    Bot,
    Users,
    MessageSquare,
    FolderOpen,
} from 'lucide-react';

const Sidebar = () => {
    const userRoles = JSON.parse(localStorage.getItem('roles') || '[]');

    const studentItems = [
        { icon: LayoutDashboard, label: 'Tổng quan', path: '/stms/student' },
        { icon: CheckSquare, label: 'Nhiệm vụ', path: '/stms/student/tasks' },
        { icon: Calendar, label: 'Lịch học', path: '/stms/student/schedule' },
        { icon: BookOpen, label: 'Môn học', path: '/stms/student/subjects' },
        { icon: Timer, label: 'Pomodoro', path: '/stms/student/pomodoro' },
        { icon: Bot, label: 'EduFlow AI', path: '/stms/student/ai' },
        { icon: Users, label: 'Cộng đồng', path: '/stms/student/community/group' },
        { icon: FolderOpen, label: 'Thư viện tài liệu', path: '/stms/student/resources' },
    ];

    let menuItems = studentItems;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        localStorage.removeItem('username');
        window.location.href = '/stms/login';
    };

    return (
        <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col fixed left-0 top-0 transition-colors">
            <div className="p-6">
                <div className="flex items-center space-x-3 text-primary-600">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 dark:shadow-primary-900">
                        <BookOpen size={24} />
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">EduFlow</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/stms/student' || item.path === '/stms/admin' || item.path === '/stms/student/community/group'}
                        className={({ isActive }) => {
                            // Community sidebar item should be active on both /group and /friends
                            const isCommunityActive = item.path === '/stms/student/community/group' &&
                                window.location.pathname.startsWith('/stms/student/community/');
                            return `
              flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group
              ${(isActive || isCommunityActive)
                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
            `;
                        }}
                    >
                        <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>


        </div>
    );
};

export default Sidebar;
