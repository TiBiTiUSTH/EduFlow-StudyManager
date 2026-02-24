import React from 'react';
import { Book, Star, FileText, ChevronRight, GraduationCap, Video } from 'lucide-react';

const SubjectCard = ({ title, teacher, tasksCount, color, icon: Icon }) => (
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-5 -mr-16 -mt-16 rounded-full transition-transform group-hover:scale-150 duration-700`} />

        <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
            <Icon size={28} />
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6 flex items-center">
            <GraduationCap size={16} className="mr-2" /> {teacher}
        </p>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
            <div className="text-center">
                <p className="text-lg font-bold text-slate-900">{tasksCount}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nhiệm vụ</p>
            </div>
            <div className="text-center border-l border-slate-50">
                <p className="text-lg font-bold text-slate-900">8.5</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Điểm TB</p>
            </div>
        </div>

        <button className="w-full mt-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
            Vào lớp học <ChevronRight size={16} className="ml-1" />
        </button>
    </div>
);

const SubjectsPage = () => {
    const subjects = [
        { title: 'Toán học', teacher: 'Thầy Trần Hùng', tasksCount: 12, color: 'bg-blue-600', icon: Book },
        { title: 'Tiếng Anh', teacher: 'Cô Mai Lan', tasksCount: 8, color: 'bg-indigo-600', icon: GraduationCap },
        { title: 'Vật Lý', teacher: 'Thầy Lê Minh', tasksCount: 5, color: 'bg-emerald-600', icon: FileText },
        { title: 'Tin học', teacher: 'Cô Thu Hà', tasksCount: 4, color: 'bg-amber-600', icon: Video },
    ];

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Môn học của tôi 🎓</h1>
                    <p className="text-slate-500">Toàn bộ kho tàng kiến thức của bạn tập trung tại đây.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center space-x-2">
                        <Star size={18} className="text-amber-400" />
                        <span>Môn học yêu thích</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {subjects.map((s, i) => (
                    <SubjectCard key={i} {...s} />
                ))}
            </div>

            <section className="bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl space-y-6">
                        <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
                            <Sparkle className="text-amber-400" size={16} /> <span>Mới: AI Learning Path</span>
                        </div>
                        <h2 className="text-4xl font-black leading-tight">Phân tích năng lực học tập cùng AI</h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            EduFlow AI sẽ dựa trên kết quả các môn học để xây dựng lộ trình luyện tập riêng biệt cho bạn, tập trung vào các mảng kiến thức còn hổng.
                        </p>
                        <button className="bg-primary-500 text-white px-10 py-4 rounded-3xl font-black text-lg shadow-xl shadow-primary-500/20 hover:scale-105 transition-transform">
                            Bắt đầu Phân tích
                        </button>
                    </div>
                    <div className="w-80 h-80 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-[64px] flex items-center justify-center rotate-12 shadow-2xl relative">
                        <div className="absolute inset-4 bg-white/10 rounded-[48px] backdrop-blur-sm" />
                        <Book size={120} className="text-white relative" />
                    </div>
                </div>
            </section>
        </div>
    );
};

// Help helper for Sparkle icon
const Sparkle = ({ className, size }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.9L12 17l-6.2 5 2.4-7.9L2 9.6h7.6L12 2z" />
    </svg>
);

export default SubjectsPage;
