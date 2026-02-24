import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = ({ isAdminLogin }) => {
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

            // Use 127.0.0.1 for consistency with current browser URL
            const response = await axios.post('http://127.0.0.1:8000/stms/auth/login', formData);

            const { access_token, roles } = response.data;

            // Kiểm tra tính hợp lệ của Portal
            if (isAdminLogin && !roles.includes('admin')) {
                setError('Đây không phải tài khoản Quản trị viên!');
                setLoading(false);
                return;
            }

            if (!isAdminLogin && roles.includes('admin')) {
                setError('Admin vui lòng đăng nhập tại trang quản trị!');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', access_token);
            localStorage.setItem('roles', JSON.stringify(roles));
            localStorage.setItem('username', response.data.username);

            // Điều hướng dựa trên role
            if (roles.includes('admin')) navigate('/stms/admin');
            else if (roles.includes('parent')) navigate('/stms/parent');
            else navigate('/stms/student');

        } catch (err) {
            console.error("Login error:", err);
            const msg = err.response?.data?.detail;
            setError(typeof msg === 'string' ? msg : 'Tên đăng nhập hoặc mật khẩu không đúng!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
            {/* Animated Background Soft Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.4, 1],
                        rotate: [0, 90, 0],
                        x: [0, 100, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className={`absolute top-[-20%] left-[-15%] w-[80%] h-[80%] rounded-full blur-[100px] opacity-20 ${isAdminLogin ? 'bg-rose-400' : 'bg-blue-400'}`}
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -90, 0],
                        x: [0, -80, 0],
                        y: [0, -100, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className={`absolute bottom-[-25%] right-[-15%] w-[70%] h-[70%] rounded-full blur-[100px] opacity-20 ${isAdminLogin ? 'bg-orange-400' : 'bg-indigo-400'}`}
                />
                <motion.div
                    animate={{
                        opacity: [0.1, 0.4, 0.1],
                        scale: [0.7, 1.2, 0.7]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute top-[10%] right-[5%] w-[50%] h-[50%] rounded-full blur-[80px] ${isAdminLogin ? 'bg-red-200' : 'bg-sky-200'}`}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white border border-slate-200/60 p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col items-center mb-10">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg mb-6 ${isAdminLogin ? 'bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-200' : 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-200'}`}
                        >
                            <GraduationCap className="text-white w-12 h-12" />
                        </motion.div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">EduFlow</h1>
                        <p className="text-slate-500 font-medium text-lg">{isAdminLogin ? 'Cổng Quản trị viên' : 'Hệ thống Học tập'}</p>
                        <div className={`h-1 w-8 rounded-full mt-3 ${isAdminLogin ? 'bg-rose-400' : 'bg-blue-400'}`}></div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Tên đăng nhập</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all font-medium ${isAdminLogin ? 'focus:ring-rose-100 focus:border-rose-400' : 'focus:ring-blue-100 focus:border-blue-400'}`}
                                    placeholder="Username của bạn"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Mật khẩu</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all font-medium ${isAdminLogin ? 'focus:ring-rose-100 focus:border-rose-400' : 'focus:ring-blue-100 focus:border-blue-400'}`}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold py-3 px-4 rounded-xl text-center shadow-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="pt-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className={`w-full text-white font-bold text-lg py-4 rounded-2xl shadow-xl flex items-center justify-center space-x-3 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${isAdminLogin ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-rose-200' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-200'}`}
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <span>Đăng nhập</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-100 text-center space-y-4">
                        {!isAdminLogin ? (
                            <p className="text-slate-600 font-medium">
                                Chưa có tài khoản? <Link to="/stms/register" className="text-blue-600 font-bold hover:text-blue-700 underline underline-offset-4 decoration-2 transition-colors">Đăng ký ngay</Link>
                            </p>
                        ) : (
                            <Link to="/stms/login" className="text-slate-400 hover:text-slate-600 text-sm font-bold transition-colors block">
                                Quay lại trang người dùng
                            </Link>
                        )}
                        <p className="text-slate-300 text-xs font-bold tracking-widest uppercase">
                            EduFlow STMS &copy; 2026
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
