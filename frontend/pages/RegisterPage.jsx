import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Lock, User, Mail, ArrowRight, Loader2, UserCircle, Users, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [step, setStep] = useState(1); // 1: Info, 2: OTP
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
        role: 'student'
    });
    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://127.0.0.1:8000/stms/auth/register', formData);
            setStep(2);
            setSuccess('Mã OTP đã được gửi (Check console backend!)');
        } catch (err) {
            setError(err.response?.data?.detail || 'Đăng ký thất bại, vui lòng kiểm tra lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://127.0.0.1:8000/stms/auth/verify-otp', {
                username: formData.username,
                otp_code: otpCode
            });
            setSuccess('Xác thực thành công! Đang chuyển hướng...');
            setTimeout(() => navigate('/stms/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Mã OTP không đúng!');
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
                    className="absolute top-[-20%] left-[-15%] w-[80%] h-[80%] rounded-full blur-[100px] opacity-20 bg-blue-400"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -90, 0],
                        x: [0, -80, 0],
                        y: [0, -100, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-25%] right-[-15%] w-[70%] h-[70%] rounded-full blur-[100px] opacity-20 bg-indigo-400"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-200 mb-6">
                            <GraduationCap className="text-white w-12 h-12" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Tạo tài khoản</h1>
                        <p className="text-slate-500 font-medium">Bắt đầu hành trình cùng EduFlow</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="info"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleRegister}
                                className="space-y-5"
                            >
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Họ và tên</label>
                                        <input
                                            name="full_name"
                                            type="text"
                                            required
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                            placeholder="Nguyễn Văn A"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Username</label>
                                        <input
                                            name="username"
                                            type="text"
                                            required
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                            placeholder="van_a"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Email</label>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                            placeholder="a@gmail.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Mật khẩu</label>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-4 ml-1">Bạn là ai?</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'student' })}
                                            className={`p-5 rounded-2xl border-2 flex flex-col items-center transition-all ${formData.role === 'student' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                                        >
                                            <GraduationCap size={28} className="mb-2" />
                                            <span className="font-bold">Học sinh</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'parent' })}
                                            className={`p-5 rounded-2xl border-2 flex flex-col items-center transition-all ${formData.role === 'parent' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                                        >
                                            <Users size={28} className="mb-2" />
                                            <span className="font-bold">Phụ huynh</span>
                                        </button>
                                    </div>
                                </div>

                                {error && <p className="text-rose-600 text-sm font-bold text-center bg-rose-50 py-3 rounded-xl">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-3"
                                >
                                    {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <><span>Tiếp tục</span> <ArrowRight size={20} /></>}
                                </button>
                                <p className="text-center text-slate-500 font-medium">
                                    Đã có tài khoản? <Link to="/stms/login" className="text-blue-600 font-bold hover:underline">Đăng nhập</Link>
                                </p>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="otp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onSubmit={handleVerify}
                                className="space-y-8 text-center"
                            >
                                <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl text-amber-700 text-sm font-medium">
                                    Mã OTP xác thực đã được gửi! (Kiểm tra terminal backend)
                                </div>
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-6 text-center text-4xl font-black tracking-[0.5em] text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100"
                                    placeholder="000000"
                                    required
                                />

                                {error && <p className="text-rose-600 text-sm font-bold bg-rose-50 py-3 rounded-xl">{error}</p>}
                                {success && <p className="text-emerald-600 text-sm font-bold bg-emerald-50 py-3 rounded-xl flex items-center justify-center gap-2"><CheckCircle size={20} /> {success}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl py-5 rounded-2xl shadow-lg"
                                >
                                    {loading ? <Loader2 className="animate-spin mx-auto w-7 h-7" /> : "Hoàn tất đăng ký"}
                                </button>
                                <button type="button" onClick={() => setStep(1)} className="text-slate-400 font-bold text-sm hover:text-slate-600">Quay lại</button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
