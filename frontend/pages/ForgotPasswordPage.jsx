import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ArrowLeft, Mail, ShieldCheck, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    if (!email.trim()) return;
    setLoading(true); setError('');
    try {
      await axios.post(`${API}/stms/auth/forgot-password`, { email });
      setStep(2);
    } catch (e) {
      setError(e.response?.data?.detail || 'Không tìm thấy email');
    }
    setLoading(false);
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) { setError('Mật khẩu không khớp'); return; }
    if (newPassword.length < 6) { setError('Mật khẩu ít nhất 6 ký tự'); return; }
    setLoading(true); setError('');
    try {
      await axios.post(`${API}/stms/auth/reset-password`, { email, otp_code: otp, new_password: newPassword });
      setStep(3);
    } catch (e) {
      setError(e.response?.data?.detail || 'Mã OTP không đúng');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-3xl shadow-xl p-10 w-full max-w-md">

        {step === 3 ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Đặt lại thành công!</h2>
            <p className="text-slate-500 mb-6">Mật khẩu đã được cập nhật. Đăng nhập ngay.</p>
            <button onClick={() => navigate('/stms/login')}
              className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors">
              Đăng nhập
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => step === 1 ? navigate('/stms/login') : setStep(1)}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
              <ArrowLeft size={16} /> {step === 1 ? 'Quay lại đăng nhập' : 'Nhập lại email'}
            </button>

            <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <KeyRound size={40} className="text-primary-500" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 text-center mb-2">Quên mật khẩu</h2>

            {step === 1 ? (
              <>
                <p className="text-slate-500 text-center mb-8">Nhập email để nhận mã xác thực</p>
                <div className="space-y-4">
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendOtp()}
                      placeholder="Email đăng ký" className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none" />
                  </div>
                  {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
                  <button onClick={sendOtp} disabled={loading || !email.trim()}
                    className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 disabled:opacity-50 transition-colors">
                    {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-slate-500 text-center mb-8">Nhập mã OTP và mật khẩu mới</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-1 block">Mã OTP (6 số)</label>
                    <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Nhập mã 6 số" className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-center font-mono font-bold text-xl tracking-[0.5em] focus:border-primary-500 outline-none" />
                  </div>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      placeholder="Mật khẩu mới" className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:border-primary-500 outline-none" />
                  </div>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && resetPassword()}
                      placeholder="Xác nhận mật khẩu" className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:border-primary-500 outline-none" />
                  </div>
                  {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
                  <button onClick={resetPassword} disabled={loading || !otp || !newPassword}
                    className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 disabled:opacity-50 transition-colors">
                    {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
