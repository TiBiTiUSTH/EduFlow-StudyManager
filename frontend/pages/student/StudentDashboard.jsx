import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Clock,
    Trophy,
    TrendingUp,
    BookOpen,
    Calendar as CalendarIcon
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <Icon size={24} />
            </div>
            {trend && (
                <span className="flex items-center text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp size={12} className="mr-1" /> {trend}
                </span>
            )}
        </div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <div className="flex items-baseline space-x-1 mt-1">
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
    </div>
);


const StudentDashboard = () => {
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Chào buổi sáng, Thế Anh! 👋</h1>
                    <p className="text-slate-500">Hãy cùng hoàn thành các mục tiêu học tập hôm nay nhé.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={CheckCircle2} label="Nhiệm vụ xong" value="12/15" color="bg-green-500" trend="+20%" />
                <StatCard icon={Clock} label="Giờ học tuần này" value="24.5h" color="bg-primary-500" trend="+5h" />
                <StatCard icon={CalendarIcon} label="Sự kiện sắp tới" value="3" color="bg-amber-500" />
                <StatCard icon={Trophy} label="Điểm tích lũy" value="1,250" color="bg-indigo-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[400px] flex items-center justify-center text-slate-400 italic">
                        Biểu đồ tiến độ học tập (Recharts) sẽ ở đây
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Study Tips Panel */}
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl p-6 text-white shadow-xl">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <BookOpen size={20} />
                            </div>
                            <h3 className="font-bold text-lg">Mẹo học tập hiệu quả</h3>
                        </div>
                        <div className="space-y-3">
                            {["Bắt đầu với nhiệm vụ quan trọng nhất.", "Nghỉ ngơi sau mỗi 25 phút học tập.", "Giữ góc học tập gọn gàng và tập trung."].map((tip, i) => (
                                <div key={i} className="flex items-start space-x-2 bg-white/10 p-3 rounded-xl">
                                    <span className="text-amber-300 font-bold mt-0.5">•</span>
                                    <p className="text-sm">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-primary-600 p-8 rounded-3xl text-white shadow-xl">
                        <h4 className="font-bold text-lg mb-2 flex items-center">
                            <Trophy size={20} className="mr-2" /> Mục tiêu tuần
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span>Hoàn thành 15 task</span>
                                <span className="font-bold">12/15</span>
                            </div>
                            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                                <div className="bg-white h-full w-[80%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
