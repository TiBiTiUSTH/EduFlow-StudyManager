import React, { useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Ép buộc dark mode
        document.documentElement.classList.add('dark');

        // Kiểm tra quyền admin
        const token = localStorage.getItem('admin_token');
        const roles = JSON.parse(localStorage.getItem('admin_roles') || '[]');

        if (!token || !roles.includes('admin')) {
            navigate('/stms/admin/login');
        }

        return () => document.documentElement.classList.remove('dark');
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-red-500/30">
            {/* Thanh Sidebar cố định */}
            <AdminSidebar />

            {/* Thanh Header cố định */}
            <AdminHeader />

            {/* Nội dung chính */}
            <main className="ml-64 pt-20">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
