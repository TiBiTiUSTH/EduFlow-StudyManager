import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, KeyRound, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {

    useEffect(() => {
        document.documentElement.classList.add('dark');
        return () => document.documentElement.classList.remove('dark');
    }, []);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('username', username.trim());
            formData.append('password', password);

            const response = await axios.post('/stms/auth/login', formData);
            const { access_token, roles } = response.data;

            if (!roles.includes('admin')) {
                setError('Tài khoản không có quyền hạn Quản trị viên (Admin).');
                setLoading(false);
                return;
            }

            localStorage.setItem('admin_token', access_token);
            localStorage.setItem('admin_roles', JSON.stringify(roles));
            localStorage.setItem('admin_username', response.data.username);

            window.location.href = '/stms/admin';

        } catch (err) {
            console.error("Admin Login error:", err);
            const msg = err.response?.data?.detail;
            setError(typeof msg === 'string' ? msg : 'Xác thực thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans relative overflow-hidden">
            {/* Hình nền lưới */}
            <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm z-10"
            >
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(239,68,68,0.5)]">
                        <Shield className="text-red-500" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">EduFlow Admin Portal</h1>
                    <p className="text-slate-400 font-medium text-sm">Hệ thống bảo mật cấp cao</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Định danh Quản trị</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                                placeholder="Admin ID"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mã bảo mật</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm py-2.5 px-4 rounded-lg text-center font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 mt-4"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    Xác thực Quyền truy cập
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-xs text-slate-600 font-mono">
                    <p>WARNING: UNAUTHORIZED ACCESS IS PROHIBITED</p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
