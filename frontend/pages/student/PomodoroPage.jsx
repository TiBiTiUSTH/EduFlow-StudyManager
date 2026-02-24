import React from 'react';
import PomodoroTimer from '../../components/UI/PomodoroTimer';
import { Brain, Sparkles, MessageSquare } from 'lucide-react';

const PomodoroPage = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Đồng hồ Pomodoro 🍅</h1>
                <p className="text-slate-500">Tập trung cao độ, nghỉ ngơi hợp lý để đạt hiệu quả tốt nhất.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                <div className="lg:col-span-3">
                    <PomodoroTimer />
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <Sparkles className="text-amber-400" size={20} />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                            <Brain size={20} className="mr-2 text-indigo-500" /> AI Nhận định
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Dựa trên lịch sử của bạn, bạn thường tập trung tốt nhất vào khung giờ <strong>8:00 - 10:00 sáng</strong>. Hôm nay hãy thử thực hiện 4 phiên liên tục nhé!
                        </p>
                    </div>

                    <div className="bg-indigo-600 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-100">
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                            <MessageSquare size={20} className="mr-2" /> Mẹo tập trung
                        </h3>
                        <ul className="space-y-3 text-indigo-100 text-sm">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                Tắt thông báo điện thoại.
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                Dọn dẹp bàn học ngăn nắp.
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                Chuẩn bị sẵn một ly nước.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PomodoroPage;
