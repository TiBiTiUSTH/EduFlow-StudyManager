import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    ShieldCheck,
    Database,
    Activity,
    Users,
    RefreshCcw,
    UserPlus,
    Search,
    CheckCircle,
    Server
} from 'lucide-react';
import { useToast } from '../../components/UI/Toast';

const AdminStat = ({ label, value, icon: Icon, color }) => (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm flex items-center space-x-4">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
            <Icon size={28} />
        </div>
        <div>
            <p className="text-slate-400 text-sm font-medium">{label}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total_users: 0, active_rooms: 0, completed_tasks: 0 });
    const [health, setHealth] = useState({ cpu_usage: 0, ram_usage: 0, disk_usage: 0, uptime_seconds: 0 });
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const addToast = useToast();

    // Trạng thái chuyển đổi
    const [autoScan, setAutoScan] = useState(true);
    const [maintenance, setMaintenance] = useState(false);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const headers = { Authorization: `Bearer ${token}` };

            const [statsRes, healthRes, logsRes, settingsRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/stms/admin/stats', { headers }),
                axios.get('http://127.0.0.1:8000/stms/admin/system-health', { headers }),
                axios.get('http://127.0.0.1:8000/stms/admin/logs', { headers }),
                axios.get('http://127.0.0.1:8000/stms/admin/settings', { headers })
            ]);

            setStats(statsRes.data);
            setHealth(healthRes.data);
            setLogs(logsRes.data);
            setAutoScan(settingsRes.data.auto_scan);
            setMaintenance(settingsRes.data.maintenance_mode);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching admin data:", error);
            setLoading(false);
        }
    };

    // Lần lấy dữ liệu ban đầu
    useEffect(() => {
        fetchDashboardData();
        const intervalId = setInterval(fetchDashboardData, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const formatUptime = (seconds) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor(seconds % (3600 * 24) / 3600);
        const m = Math.floor(seconds % 3600 / 60);
        return `${d}d ${h}h ${m}m`;
    };

    const handleCleanDB = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const res = await axios.post('http://127.0.0.1:8000/stms/admin/cleanup', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast(res.data.message, 'success');
        } catch (error) {
            addToast('Lỗi khi dọn dẹp hệ thống.', 'error');
        }
    };

    const toggleSetting = async (key, currentValue) => {
        try {
            const token = localStorage.getItem('admin_token');
            const headers = { Authorization: `Bearer ${token}` };

            const settingsRes = await axios.get('http://127.0.0.1:8000/stms/admin/settings', { headers });
            const newSettings = { ...settingsRes.data, [key]: !currentValue };

            await axios.post('http://127.0.0.1:8000/stms/admin/settings', newSettings, { headers });

            if (key === 'auto_scan') setAutoScan(!currentValue);
            if (key === 'maintenance_mode') setMaintenance(!currentValue);

        } catch (error) {
            addToast('Không thể cập nhật cấu hình.', 'error');
        }
    };

    if (loading && stats.total_users === 0) {
        return <div className="text-white flex justify-center py-20"><RefreshCcw className="animate-spin text-red-500" size={32} /></div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Bảng điều khiển </h1>
                </div>
                <div className="flex space-x-3">
                    <button onClick={() => { fetchDashboardData(); addToast('Đã làm mới dữ liệu hệ thống.', 'success'); }} className="bg-slate-800 text-white px-5 py-2.5 rounded-2xl flex items-center space-x-2 border border-slate-700 hover:bg-slate-700 transition-all font-semibold text-sm">
                        <RefreshCcw size={18} />
                        <span>Làm mới</span>
                    </button>
                    <button onClick={handleCleanDB} className="bg-slate-800 text-white px-5 py-2.5 rounded-2xl flex items-center space-x-2 border border-slate-700 hover:bg-slate-700 transition-all font-semibold text-sm">
                        <Database size={18} />
                        <span>Dọn dẹp</span>
                    </button>
                </div>
            </div>

            {/* Grid số liệu Admin */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStat icon={Database} label="Người dùng" value={stats.total_users} color="bg-blue-600" />
                <AdminStat icon={Activity} label="Tiến trình" value={stats.active_rooms} color="bg-green-500" />
                <AdminStat icon={CheckCircle} label="Nhiệm vụ xử lý" value={stats.completed_tasks} color="bg-amber-500" />
                <AdminStat icon={ShieldCheck} label="Trạng thái API" value="Ổn định" color="bg-indigo-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System logs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white">System Logs</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm kiếm mã lỗi, PID..."
                                    className="bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-9 pr-4 text-sm w-48 text-slate-300 focus:border-red-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {logs
                                .filter(log => log.details.toLowerCase().includes(searchTerm.toLowerCase()) || log.action.toLowerCase().includes(searchTerm.toLowerCase()) || (log.pid && log.pid.toString().includes(searchTerm)))
                                .length > 0 ? logs
                                    .filter(log => log.details.toLowerCase().includes(searchTerm.toLowerCase()) || log.action.toLowerCase().includes(searchTerm.toLowerCase()) || (log.pid && log.pid.toString().includes(searchTerm)))
                                    .map((log, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm ${log.action.includes('Task') ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                                    {log.action.includes('Task') ? <Activity size={18} /> : <Database size={18} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{log.action}</p>
                                                    <p className="text-xs text-slate-400 font-mono">{log.details} - [PID: {log.pid || 1026}]</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-500">{log.timestamp}</span>
                                        </div>
                                    )) : (
                                <p className="text-slate-500 text-center py-4">Không tìm thấy kết quả phù hợp.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tình trạng hệ thống / Cấu hình nhanh */}
                <div className="space-y-8">
                    <div className="bg-slate-950 border border-slate-800 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                        <Server className="absolute -right-6 -bottom-6 text-slate-800/50" size={120} />

                        <h3 className="font-bold text-lg mb-6 flex items-center relative z-10">
                            <Activity size={20} className="mr-2 text-red-500" /> Máy chủ
                        </h3>
                        <div className="space-y-6 relative z-10">
                            <div>
                                <div className="flex justify-between text-sm mb-2 text-slate-400 font-medium">
                                    <span>CPU (Cores)</span>
                                    <span className={health.cpu_usage > 80 ? 'text-red-400' : 'text-green-400'}>{health.cpu_usage}%</span>
                                </div>
                                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${health.cpu_usage > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${health.cpu_usage}%` }}>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2 text-slate-400 font-medium">
                                    <span>Bộ nhớ RAM</span>
                                    <span className={health.ram_usage > 80 ? 'text-red-400' : 'text-blue-400'}>{health.ram_usage}%</span>
                                </div>
                                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${health.ram_usage > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                                        style={{ width: `${health.ram_usage}%` }}>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2 text-slate-400 font-medium">
                                    <span>Ổ cứng Hệ thống</span>
                                    <span className="text-amber-400">{health.disk_usage}%</span>
                                </div>
                                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                    <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${health.disk_usage}%` }}></div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                <span className="text-sm text-slate-400">Thời gian Uptime</span>
                                <span className="text-sm font-mono text-red-400">{formatUptime(health.uptime_seconds)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm">
                        <h3 className="font-bold text-white mb-4">Cấu hình Hệ thống Tự động</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
                                <span className="text-sm text-slate-300">Quét rác tự động</span>
                                <div
                                    onClick={() => toggleSetting('auto_scan', autoScan)}
                                    className={`w-10 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${autoScan ? 'bg-red-600 justify-end' : 'bg-slate-800 justify-start'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full ${autoScan ? 'bg-white' : 'bg-slate-400'}`}></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
                                <span className="text-sm text-slate-300">Bảo trì Server</span>
                                <div
                                    onClick={() => {
                                        toggleSetting('maintenance_mode', maintenance);
                                        if (!maintenance) addToast('Chế độ bảo trì đã được bật.', 'warning', 5000);
                                        else addToast('Đã tắt chế độ bảo trì.', 'success');
                                    }}
                                    className={`w-10 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${maintenance ? 'bg-red-600 justify-end' : 'bg-slate-800 justify-start'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full ${maintenance ? 'bg-white' : 'bg-slate-400'}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
