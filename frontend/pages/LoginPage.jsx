import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, Loader2, Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    useEffect(() => {
        const root = document.documentElement;
        const wasDark = root.classList.contains('dark');
        root.classList.remove('dark');
        const observer = new MutationObserver(() => {
            if (root.classList.contains('dark')) {
                root.classList.remove('dark');
            }
        });
        observer.observe(root, { attributes: true, attributeFilter: ['class'] });

        return () => {
            observer.disconnect();
            if (wasDark) root.classList.add('dark');
        };
    }, []);
    const [username, setUsername] = useState(localStorage.getItem('saved_username') || '');
    const [password, setPassword] = useState(localStorage.getItem('saved_password') || '');
    const [rememberMe, setRememberMe] = useState(localStorage.getItem('remember_me') === 'true');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Quên mật khẩu
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [forgotStep, setForgotStep] = useState(1);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotOtp, setForgotOtp] = useState('');
    const [forgotNewPassword, setForgotNewPassword] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('username', username.trim());
            formData.append('password', password);

            const response = await axios.post('http://127.0.0.1:8000/stms/auth/login', formData);
            const { access_token, roles } = response.data;

            if (roles.includes('admin') || roles.includes('parent')) {
                setError('Vui lòng đăng nhập tại cổng dành đúng cho tài khoản của bạn!');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', access_token);
            localStorage.setItem('roles', JSON.stringify(roles));
            localStorage.setItem('username', response.data.username);

            if (rememberMe) {
                localStorage.setItem('saved_username', username.trim());
                localStorage.setItem('saved_password', password);
                localStorage.setItem('remember_me', 'true');
            } else {
                localStorage.removeItem('saved_username');
                localStorage.removeItem('saved_password');
                localStorage.removeItem('remember_me');
            }

            sessionStorage.removeItem('eduflow-onboarding-shown');

            window.location.href = '/stms/student';

        } catch (err) {
            console.error("Login error:", err);
            const msg = err.response?.data?.detail;
            setError(typeof msg === 'string' ? msg : 'Tên đăng nhập hoặc mật khẩu không đúng!');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setForgotSuccess('');
        try {
            await axios.post('http://127.0.0.1:8000/stms/auth/forgot-password', { email: forgotEmail });
            setForgotStep(2);
            setForgotSuccess('Mã OTP đã được gửi đến email của bạn!');
        } catch (err) {
            setError(err.response?.data?.detail || 'Lỗi gửi OTP!');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setForgotSuccess('');
        try {
            await axios.post('http://127.0.0.1:8000/stms/auth/reset-password', {
                email: forgotEmail,
                otp_code: forgotOtp,
                new_password: forgotNewPassword
            });
            setForgotSuccess('Đặt lại mật khẩu thành công...');
            setTimeout(() => {
                setIsForgotPassword(false);
                setForgotStep(1);
                setForgotEmail(''); setForgotOtp(''); setForgotNewPassword('');
                setForgotSuccess('');
                setError('');
            }, 2500);
        } catch (err) {
            setError(err.response?.data?.detail || 'Mã OTP không đúng!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex relative overflow-hidden font-sans">

            {/* Thanh điều hướng trên cùng */}
            <div className="absolute top-0 w-full h-20 bg-white border-b border-slate-100 flex items-center px-10 justify-between z-50">
                <div className="flex items-center space-x-2">
                    <GraduationCap className="text-slate-900" size={32} />
                    <span className="font-black text-2xl tracking-tighter text-slate-900">EduFlow</span>
                </div>
                <div className="hidden md:flex gap-6 items-center font-bold text-sm">
                    <Link to="/stms/register" className="bg-primary-400 hover:bg-primary-500 text-slate-900 px-6 py-2.5 rounded-full transition-colors">Đăng ký mới</Link>
                </div>
            </div>

            {/*Svg trang trí */}
            <svg className="absolute top-0 left-0 w-[60%] h-full opacity-60 pointer-events-none -translate-x-[20%]" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                <path d="M100,500 Q300,100 500,500 T900,500" fill="none" stroke="url(#mintGradient)" strokeWidth="80" strokeLinecap="round" opacity="0.8" />
                <path d="M200,800 Q400,400 600,800 T1000,800" fill="none" stroke="url(#magentaGradient)" strokeWidth="60" strokeLinecap="round" opacity="0.9" />
                <defs>
                    <linearGradient id="mintGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="magentaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Bố cục */}
            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center pt-20 px-6 lg:px-12 z-10 gap-16 lg:gap-24">

                {/* Bên trái: Slogan */}
                <div className="flex-1 text-center lg:text-left pt-12 lg:pt-0 z-20 relative">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6"
                    >
                        Hệ thống Quản lý <br className="hidden lg:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
                            Học tập
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg lg:text-xl text-slate-600 font-medium max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
                    >
                        EduFlow là giải pháp giúp Học sinh & Sinh viên làm chủ quá trình học tập: Sắp xếp nhiệm vụ môn học, duy trì sự tập trung, và tra cứu tài liệu.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden lg:flex flex-wrap gap-3 max-w-lg"
                    >
                    </motion.div>
                </div>

                {/* Form Đăng nhập */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md shrink-0"
                >
                    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-10 rounded-[2rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] relative">

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-slate-900">
                                {isForgotPassword ? 'Khôi phục mật khẩu' : 'Đăng nhập vào hệ thống'}
                            </h2>
                        </div>

                        {!isForgotPassword ? (
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all font-medium"
                                            placeholder="Tên đăng nhập"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all font-medium"
                                            placeholder="Mật khẩu"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 text-slate-900 bg-slate-50 border-slate-300 rounded focus:ring-slate-900 focus:ring-2 cursor-pointer"
                                    />
                                    <label htmlFor="rememberMe" className="ml-2 text-sm font-medium text-slate-700 cursor-pointer select-none">
                                        Nhớ mật khẩu
                                    </label>
                                </div>

                                {error && (
                                    <div className="bg-rose-50 text-rose-600 text-sm font-bold py-3 px-4 rounded-xl text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-3.5 rounded-xl flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Đăng nhập"}
                                </button>

                                <div className="text-center mt-6">
                                    <button
                                        type="button"
                                        onClick={() => { setIsForgotPassword(true); setError(''); }}
                                        className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-slate-900"
                                    >
                                        Quên mật khẩu?
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                {forgotStep === 1 ? (
                                    <form onSubmit={handleForgotPassword} className="space-y-5">
                                        <div>
                                            <input
                                                type="email"
                                                value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                                                placeholder="Email đã đăng ký"
                                                required
                                            />
                                        </div>
                                        {error && <p className="text-rose-600 text-sm font-bold text-center">{error}</p>}
                                        <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all flex justify-center">
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Nhận mã xác nhận"}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleResetPassword} className="space-y-5">
                                        {forgotSuccess && <p className="text-emerald-600 text-sm font-bold text-center mb-2">{forgotSuccess}</p>}
                                        <input
                                            type="text"
                                            maxLength="6"
                                            value={forgotOtp}
                                            onChange={(e) => setForgotOtp(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 text-center text-2xl font-black tracking-[0.5em] text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                            placeholder="000000"
                                            required
                                        />
                                        <input
                                            type="password"
                                            value={forgotNewPassword}
                                            onChange={(e) => setForgotNewPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                            placeholder="Mật khẩu mới"
                                            required
                                        />
                                        {error && <p className="text-rose-600 text-sm font-bold text-center">{error}</p>}
                                        <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl flex justify-center">
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Hoàn tất"}
                                        </button>
                                    </form>
                                )}
                                <div className="text-center pt-2">
                                    <button type="button" onClick={() => { setIsForgotPassword(false); setForgotStep(1); setError(''); setForgotSuccess(''); }} className="text-slate-400 font-bold hover:text-slate-900 text-sm transition-colors">
                                        Đăng nhập lại
                                    </button>
                                </div>
                            </div>
                        )}


                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
