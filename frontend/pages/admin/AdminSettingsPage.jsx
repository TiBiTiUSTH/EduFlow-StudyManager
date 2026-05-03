import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, ShieldAlert, Mail, Database, Save, RotateCcw } from 'lucide-react';
import { useToast } from '../../components/UI/Toast';
import axios from 'axios';

const AdminSettingsPage = () => {
    const [settings, setSettings] = useState({
        smtp_host: 'smtp.eduflow.io',
        smtp_port: '587',
        db_pool_size: '20',
        cache_ttl: '3600',
        max_upload_size: '50'
    });
    const addToast = useToast();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const res = await axios.get('/stms/admin/settings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSettings({
                    smtp_host: res.data.smtp_host || 'smtp.eduflow.io',
                    smtp_port: res.data.smtp_port || '587',
                    db_pool_size: res.data.db_pool_size || '20',
                    cache_ttl: res.data.cache_ttl || '3600',
                    max_upload_size: res.data.max_upload_size || '50'
                });
            } catch (error) {
                console.error("Lỗi khi tải cấu hình", error);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const curRes = await axios.get('/stms/admin/settings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const merged = { ...curRes.data, ...settings };
            await axios.post('/stms/admin/settings', merged, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast('Cấu hình hệ thống đã được lưu thành công!', 'success', 4000);
        } catch (error) {
            addToast('Có lỗi xảy ra khi lưu cấu hình.', 'error');
        }
    };

    const handleReset = () => {
        setSettings({
            smtp_host: 'smtp.eduflow.io',
            smtp_port: '587',
            db_pool_size: '20',
            cache_ttl: '3600',
            max_upload_size: '50'
        });
        addToast('Đã khôi phục cấu hình về mặc định.', 'info');
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Cấu hình Server</h1>
                    <p className="text-slate-400">Tùy chỉnh thông số hệ thống và bảo mật (Yêu cầu khởi động lại Server).</p>
                </div>
                <div className="flex space-x-3">
                    <button onClick={handleReset} className="bg-slate-800 text-white px-5 py-2.5 rounded-2xl flex items-center space-x-2 border border-slate-700 hover:bg-slate-700 transition-all font-semibold text-sm">
                        <RotateCcw size={18} />
                        <span>Khôi phục mặc định</span>
                    </button>
                    <button onClick={handleSave} className="bg-red-600 text-white px-5 py-2.5 rounded-2xl flex items-center space-x-2 hover:bg-red-700 transition-all font-semibold text-sm shadow-lg shadow-red-500/20">
                        <Save size={18} />
                        <span>Lưu Cấu hình</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/*Cài đặt database */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-sm space-y-6">
                    <h3 className="font-bold text-lg flex items-center text-white">
                        <Database className="text-blue-500 mr-2" size={20} /> Cấu hình Database
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Kết nối Database</label>
                            <input
                                type="number"
                                name="db_pool_size"
                                value={settings.db_pool_size}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Bộ nhớ đệm</label>
                            <input
                                type="number"
                                name="cache_ttl"
                                value={settings.cache_ttl}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Cài đặt SMTP */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-sm space-y-6">
                    <h3 className="font-bold text-lg flex items-center text-white">
                        <Mail className="text-amber-500 mr-2" size={20} /> Mail Server (SMTP)
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">SMTP Host</label>
                            <input
                                type="text"
                                name="smtp_host"
                                value={settings.smtp_host}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">SMTP Port</label>
                            <input
                                type="text"
                                name="smtp_port"
                                value={settings.smtp_port}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Bảo mật */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-sm space-y-6 md:col-span-2">
                    <h3 className="font-bold text-lg flex items-center text-white">
                        <ShieldAlert className="text-red-500 mr-2" size={20} /> Bảo mật & Uploads
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Max Upload Size (MB)</label>
                            <input
                                type="number"
                                name="max_upload_size"
                                value={settings.max_upload_size}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">CORS Allowed Origins</label>
                            <input
                                type="text"
                                defaultValue="http://localhost:8080, http://127.0.0.1:8000"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-500 opacity-70 cursor-not-allowed"
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminSettingsPage;
