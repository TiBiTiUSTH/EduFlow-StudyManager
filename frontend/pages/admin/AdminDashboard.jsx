import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    Settings,
    Database,
    Activity,
    UserPlus,
    RefreshCcw,
    Search,
    Users
} from 'lucide-react';

const AdminStat = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
            <Icon size={28} />
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{label}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
    </div>
);

const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Hệ thống Quản trị EduFlow 🛡️</h1>
                    <p className="text-slate-500">Quản lý người dùng, cấu hình hệ thống và giám sát logs.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-red-500 text-white px-5 py-2.5 rounded-2xl flex items-center space-x-2 shadow-lg shadow-red-200 hover:bg-red-600 transition-all font-semibold text-sm">
                        <RefreshCcw size={18} />
                        <span>Reset Protocol</span>
                    </button>
                    <button className="bg-primary-600 text-white px-5 py-2.5 rounded-2xl flex items-center space-x-2 shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all font-semibold text-sm">
                        <UserPlus size={18} />
                        <span>Thêm người dùng</span>
                    </button>
                </div>
            </div>

            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStat icon={Users} label="Tổng Users" value="1,280" color="bg-blue-600" />
                <AdminStat icon={Activity} label="Đang Online" value="145" color="bg-green-500" />
                <AdminStat icon={Database} label="Dung lượng DB" value="2.4 GB" color="bg-amber-500" />
                <AdminStat icon={ShieldCheck} label="Bảo mật" value="Mạnh" color="bg-indigo-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System Logs Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">Hoạt động mới nhất</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Lọc logs..."
                                    className="bg-slate-50 border-none rounded-xl py-1.5 pl-9 pr-4 text-sm w-48 text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-600 shadow-sm">
                                            <Settings size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Admin đã cập nhật System Setting</p>
                                            <p className="text-xs text-slate-500">IP: 192.168.1.10{i}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400">14:20:05</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2.5 text-primary-600 font-bold text-sm bg-primary-50 rounded-xl hover:bg-primary-100 transition-all">
                            Xem tất cả Activity Logs
                        </button>
                    </div>
                </div>

                {/* System Health / Quick Config */}
                <div className="space-y-8">
                    <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl">
                        <h3 className="font-bold text-lg mb-6 flex items-center">
                            <Activity size={20} className="mr-2 text-green-400" /> Sức khỏe Máy chủ
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2 text-slate-400 font-medium">
                                    <span>CPU Usage</span>
                                    <span className="text-green-400">22%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-400 h-full w-[22%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2 text-slate-400 font-medium">
                                    <span>RAM Storage</span>
                                    <span className="text-blue-400">45%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-400 h-full w-[45%]"></div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                <span className="text-sm text-slate-400">Uptime</span>
                                <span className="text-sm font-mono">15d 04h 22m</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Cấu hình nhanh AI</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                <span className="text-sm">Bật AI Insights</span>
                                <div className="w-10 h-6 bg-primary-600 rounded-full flex items-center justify-end px-1">
                                    <div className="w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
