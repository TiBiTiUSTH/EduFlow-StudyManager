import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import socket from '../../lib/socket';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout = ({ children }) => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Kết nối WebSocket toàn cục khi người dùng đăng nhập
    useEffect(() => {
        if (user?.id) {
            socket.connect(user.id);
        }
        return () => {

        };
    }, [user?.id]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            {/* Thanh Sidebar cố định */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Thanh Header cố định */}
            <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* Nội dung chính */}
            <main className="md:ml-64 pt-16 md:pt-20">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
