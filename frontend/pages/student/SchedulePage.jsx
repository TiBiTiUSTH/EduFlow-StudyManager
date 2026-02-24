import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const SchedulePage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

    // Mock data for schedules
    const schedules = [
        { id: 1, title: 'Học Toán hình học', time: '08:00 - 09:30', subject: 'Toán học', color: 'bg-blue-500' },
        { id: 2, title: 'Luyện thi IELTS', time: '14:00 - 16:00', subject: 'Tiếng Anh', color: 'bg-indigo-500' },
        { id: 3, title: 'Làm bài tập Hóa', time: '19:30 - 21:00', subject: 'Hóa học', color: 'bg-emerald-500' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Lịch học tập 📅</h1>
                    <p className="text-slate-500">Tổ chức thời gian hiệu quả để đạt kết quả tối đa.</p>
                </div>
                <button className="bg-primary-600 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all font-bold">
                    <Plus size={20} />
                    <span>Thêm lịch mới</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar View Placeholder */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900">Tháng 1, 2026</h2>
                        <div className="flex space-x-2">
                            <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-4 mb-4">
                        {days.map(day => (
                            <div key={day} className="text-center text-xs font-black text-slate-400 uppercase tracking-widest">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-4">
                        {Array.from({ length: 31 }).map((_, i) => (
                            <div
                                key={i}
                                className={`aspect-square rounded-2xl flex items-center justify-center text-sm font-bold cursor-pointer transition-all
                  ${i + 1 === 29 ? 'bg-primary-600 text-white shadow-lg shadow-primary-100' : 'hover:bg-slate-50 text-slate-700'}
                `}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Today's Agenda */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 px-2">Lịch trình hôm nay</h2>
                    <div className="space-y-4">
                        {schedules.map((item) => (
                            <motion.div
                                whileHover={{ x: 10 }}
                                key={item.id}
                                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group cursor-pointer"
                            >
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${item.color}`} />
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{item.title}</h3>
                                        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg uppercase">{item.subject}</span>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center text-xs text-slate-500 font-medium">
                                            <Clock size={14} className="mr-2 text-slate-400" />
                                            {item.time}
                                        </div>
                                        <div className="flex items-center text-xs text-slate-500 font-medium">
                                            <MapPin size={14} className="mr-2 text-slate-400" />
                                            Phòng học trực tuyến
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-xl">
                        <h3 className="font-bold mb-2">Lời khuyên AI</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Bạn có 3 phiên học tập hôm nay. Đừng quên dành 15 phút tập thể dục giữa các ca nhé!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;
