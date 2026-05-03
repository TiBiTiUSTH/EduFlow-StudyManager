import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Database, CheckCircle, Search, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await axios.get('http://127.0.0.1:8000/stms/admin/logs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Giám sát Hệ thống</h1>
                </div>
                <button onClick={fetchLogs} className="bg-slate-800 text-white px-5 py-2.5 rounded-2xl flex items-center space-x-2 border border-slate-700 hover:bg-slate-700 transition-all font-semibold text-sm">
                    <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    <span>Tải lại Logs</span>
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex space-x-2">
                        <button className="px-4 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-sm font-semibold border border-red-500/20">Tất cả</button>
                        <button className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700">Lỗi</button>
                        <button className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700">Cảnh báo</button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Lọc sự kiện..."
                            className="bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-9 pr-4 text-sm w-64 text-slate-300 focus:border-red-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="text-slate-400 text-center py-10">Đang tải dữ liệu hệ thống...</div>
                    ) : logs.filter(log => log.details.toLowerCase().includes(searchTerm.toLowerCase()) || log.action.toLowerCase().includes(searchTerm.toLowerCase()) || (log.pid && log.pid.toString().includes(searchTerm))).length > 0 ? (
                        logs.filter(log => log.details.toLowerCase().includes(searchTerm.toLowerCase()) || log.action.toLowerCase().includes(searchTerm.toLowerCase()) || (log.pid && log.pid.toString().includes(searchTerm))).map((log, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm ${log.action.includes('Task') ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                        {log.action.includes('Task') ? <Activity size={18} /> : <Database size={18} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{log.action}</p>
                                        <p className="text-xs text-slate-400 font-mono mt-1">{log.details} - [PID: {log.pid || 1026}]</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-500 block mb-1">{log.timestamp}</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">SUCCESS</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 text-center py-10">Không tìm thấy logs nào phù hợp.</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default AdminLogsPage;
