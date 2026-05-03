import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username') || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCd, setResendCd] = useState(0);
  const inputs = useRef([]);

  useEffect(() => {
    if (resendCd > 0) {
      const t = setTimeout(() => setResendCd(resendCd - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCd]);

  useEffect(() => { inputs.current[0]?.focus(); }, []);

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
    if (newOtp.every(d => d !== '')) submitOtp(newOtp.join(''));
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    paste.split('').forEach((d, i) => { newOtp[i] = d; });
    setOtp(newOtp);
    if (paste.length === 6) submitOtp(paste);
  };

  const submitOtp = async (code) => {
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/stms/auth/verify-otp`, { username, otp_code: code });
      setSuccess(true);
      setTimeout(() => navigate('/stms/login'), 2000);
    } catch (e) {
      setError(e.response?.data?.detail || 'Mã OTP không đúng');
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    }
    setLoading(false);
  };

  const resendOtp = () => {
    setResendCd(60);
    //Backend sẽ gửi lại OTP qua đăng ký mới
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-3xl shadow-xl p-10 w-full max-w-md text-center">

        {success ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Xác thực thành công!</h2>
            <p className="text-slate-500">Đang chuyển đến trang đăng nhập...</p>
          </motion.div>
        ) : (
          <>
            <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Mail size={40} className="text-primary-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Xác thực Email</h2>
            <p className="text-slate-500 mb-8">Nhập mã 6 số đã gửi đến email của bạn</p>

            {/* Nhập mã OTP */}
            <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input key={i} ref={el => inputs.current[i] = el}
                  type="text" inputMode="numeric" maxLength={1}
                  value={digit} onChange={e => handleChange(e.target.value, i)}
                  onKeyDown={e => handleKeyDown(e, i)}
                  className={`w-14 h-14 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all
                    ${digit ? 'border-primary-500 bg-primary-50' : 'border-slate-200 bg-slate-50'}
                    focus:border-primary-500 focus:ring-4 focus:ring-primary-100`}
                />
              ))}
            </div>

            {error && <p className="text-red-500 text-sm font-semibold mb-4">{error}</p>}
            {loading && <p className="text-primary-500 text-sm font-semibold mb-4">Đang xác thực...</p>}

            <div className="flex items-center justify-between mt-8">
              <button onClick={() => navigate('/stms/login')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
                <ArrowLeft size={16} /> Quay lại
              </button>
              <button onClick={resendOtp} disabled={resendCd > 0}
                className="text-sm font-bold text-primary-500 hover:text-primary-600 disabled:text-slate-400">
                {resendCd > 0 ? `Gửi lại (${resendCd}s)` : 'Gửi lại mã'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
