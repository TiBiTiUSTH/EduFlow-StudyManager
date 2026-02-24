import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    MessageSquare,
    Target,
    FileText,
    AlertCircle,
    ChevronRight
} from 'lucide-react';

const StudentCard = ({ name, status, grade, lastActive }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 font-bold text-lg">
                    {name.charAt(0)}
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">{name}</h3>
                    <p className="text-xs text-slate-500">Lớp {grade}</p>
                </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status === 'Online' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
                }`}>
                {status}
            </span>
        </div>

        <div className="space-y-3">
            <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tiến độ tuần</span>
                <span className="font-semibold text-slate-900">85%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary-500 h-full w-[85%] rounded-full"></div>
            </div>
            <p className="text-[10px] text-slate-400">Hoạt động cuối: {lastActive}</p>
        </div>

        <button className="w-full mt-4 py-2 bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl group-hover:bg-primary-500 group-hover:text-white transition-all flex items-center justify-center">
            Xem chi tiết <ChevronRight size={16} className="ml-1" />
        </button>
    </div>
);

const ParentDashboard = () => {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Bảng điều khiển Phụ huynh 🏠</h1>
                    <p className="text-slate-500">Giám sát và đồng hành cùng con đường học tập của con.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl flex items-center space-x-2 shadow-sm hover:bg-slate-50 transition-all font-semibold text-sm">
                        <MessageSquare size={18} />
                        <span>Liên hệ Admin</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Student List & Quick Actions */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                            <Users size={20} className="mr-2 text-primary-500" /> Danh sách con học tập
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <StudentCard name="Thế Anh" status="Online" grade="12A1" lastActive="2 phút trước" />
                            <div className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-primary-400 hover:text-primary-500 transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-2xl">+</span>
                                </div>
                                <p className="text-sm font-medium">Thêm con/mã học sinh</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Báo cáo tổng hợp tháng 1</h2>
                        <div className="h-64 flex items-center justify-center text-slate-400 italic bg-slate-50 rounded-2xl">
                            Biểu đồ so sánh tiến độ các con sẽ hiển thị ở đây
                        </div>
                    </section>
                </div>

                {/* Right Column: Notifications & Goals */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                            <AlertCircle size={18} className="mr-2 text-amber-500" /> Thông báo mới
                        </h3>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex space-x-3 p-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer">
                                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex-shrink-0 flex items-center justify-center text-amber-600">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Thế Anh vừa hoàn thành Task Toán</p>
                                        <p className="text-xs text-slate-400">10 phút trước</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary-600 p-6 rounded-3xl text-white shadow-xl shadow-primary-100">
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                            <Target size={20} className="mr-2" /> Đặt mục tiêu học tập
                        </h3>
                        <p className="text-primary-100 text-sm mb-6">
                            Khuyến khích con bằng cách đặt ra các cột mốc và phần thưởng xứng đáng.
                        </p>
                        <button className="w-full py-3 bg-white text-primary-600 font-bold rounded-2xl hover:bg-primary-50 transition-all shadow-lg">
                            Tạo mục tiêu mới
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
