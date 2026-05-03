import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, BookOpen, Clock, Users, ChevronRight, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import QuickActionCard from "@/components/QuickActionCard";
import { OnboardingDialog } from "@/components/OnboardingDialog";
import { getSubjectMaterial } from "@/data/subjectMaterials";

const CATEGORIES = ['Tất cả', 'Cấp 1', 'Cấp 2', 'Cấp 3', 'Đại học', 'Ngoại ngữ'];

const SUGGESTED_SUBJECTS = [
    // Cấp 1
    { id: 1, title: 'Toán lớp 1: Cùng học đếm và phép tính cơ bản', category: 'Cấp 1', students: '1.2k', duration: '10 Chủ đề', author: 'Sách giáo khoa' },
    { id: 2, title: 'Tiếng Việt 3: Rèn luyện kỹ năng đọc hiểu', category: 'Cấp 1', students: '856', duration: '7 Chủ đề', author: 'Chương trình chuẩn' },
    // Cấp 2
    { id: 3, title: 'Vật Lý 9: Hiểu về Điện học và Quang học', category: 'Cấp 2', students: '2.3k', duration: '12 Chủ đề', author: 'Khoa học Tự nhiên' },
    { id: 4, title: 'Đại số 8: Phương trình và Phân thức đại số', category: 'Cấp 2', students: '1.8k', duration: '14 Chủ đề', author: 'Toán học THCS' },
    // Cấp 3
    { id: 5, title: 'Toán Đại Số 10: Mệnh đề, Hàm số và Tập hợp', category: 'Cấp 3', students: '4.5k', duration: '8 Chủ đề', author: 'Định hướng khối A' },
    { id: 6, title: 'Hóa học 12: Tổng ôn Kim loại thi THPT Quốc gia', category: 'Cấp 3', students: '3.8k', duration: '13 Chủ đề', author: 'Luyện thi Đại học' },
    { id: 7, title: 'Vật Lý 12: Dao động cơ và Sóng điện từ', category: 'Cấp 3', students: '3.1k', duration: '10 Chủ đề', author: 'Luyện thi Đại học' },
    { id: 8, title: 'Ngữ Văn 12: Nghị luận và Phân tích tác phẩm', category: 'Cấp 3', students: '5.2k', duration: '6 Chủ đề', author: 'Luyện thi Đại học' },
    // Đại học
    { id: 9, title: 'Nhập môn Lập trình Python cho người mới bắt đầu', category: 'Đại học', students: '5.6k', duration: '15 Chủ đề', author: 'Khoa học Máy tính' },
    { id: 10, title: 'Đại số Tuyến tính: Ma trận, Định thức và Không gian Vectơ', category: 'Đại học', students: '3.4k', duration: '10 Chủ đề', author: 'Toán học Đại học' },
    // Ngoại ngữ
    { id: 11, title: 'IELTS 6.5+: Tham khảo làm bài Reading & Listening', category: 'Ngoại ngữ', students: '8.9k', duration: '9 Chủ đề' },
    { id: 12, title: 'Tiếng Hàn Căn bản: Hangul và Giao tiếp hàng ngày', category: 'Ngoại ngữ', students: '2.1k', duration: '7 Chủ đề' },
];

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    // Chỉ hiển thị onboarding một lần cho mỗi phiên đăng nhập
    const [onboardingOpen, setOnboardingOpen] = useState(() => {
        const alreadyShown = sessionStorage.getItem('eduflow-onboarding-shown');
        if (alreadyShown) return false;
        return user ? !user.hasProfile : false;
    });

    const handleCloseOnboarding = (value) => {
        if (!value) sessionStorage.setItem('eduflow-onboarding-shown', 'true');
        setOnboardingOpen(value);
    };

    const [activeTab, setActiveTab] = useState('Tất cả');

    if (loading) return null;
    if (!user) return <div className="p-10 text-center">Vui lòng đăng nhập...</div>;

    const filteredSubjects = activeTab === 'Tất cả'
        ? SUGGESTED_SUBJECTS
        : SUGGESTED_SUBJECTS.filter(s => s.category === activeTab);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans -mt-8 -mx-8 transition-colors">
            <div className="bg-white dark:bg-slate-900 px-10 py-20 lg:py-28 relative overflow-hidden border-b border-slate-200 dark:border-slate-800 transition-colors">
                {/* Hình nền trang trí */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform translate-x-1/3 scale-150">
                        <path fill="#0ea5e9" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18,97.7,-2.1C98.6,13.8,94.5,30.1,84.8,43.2C75.1,56.3,59.8,66.2,43.9,73.5C28,80.8,11.5,85.5,-4.4,85.3C-20.3,85.1,-35.3,80,-48.9,72C-62.5,64,-74.7,53.2,-82.9,39.6C-91.1,26,-95.3,9.5,-93.6,-6.2C-91.9,-21.9,-84.3,-36.8,-73.4,-48.6C-62.5,-60.4,-48.3,-69.1,-34.2,-76.5C-20.1,-83.9,-6.1,-90,6.9,-89.6C19.9,-89.2,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="absolute bottom-0 left-0 w-1/3 h-full opacity-[0.07] pointer-events-none">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform -translate-x-1/4 translate-y-1/4 scale-150">
                        <path fill="#f43f5e" d="M47.7,-72.5C59.5,-63.3,65.1,-46.1,69.5,-30C73.9,-13.9,77.2,1.2,73.4,14.6C69.6,28,58.7,39.8,46.3,50C33.9,60.2,20,68.8,3.9,69.8C-12.2,70.8,-30.5,64.2,-43.3,53.1C-56.1,42,-63.4,26.4,-67.2,10.2C-71,-6,-71.4,-22.8,-63.6,-35C-55.8,-47.2,-39.8,-54.8,-25.2,-61.6C-10.6,-68.4,2.5,-74.4,18.4,-75.7C34.3,-77,35.9,-81.7,47.7,-72.5Z" transform="translate(100 100)" />
                    </svg>
                </div>

                <div className="max-w-4xl relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
                            Quản lý học tập. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-rose-500">
                                Tối ưu thời gian.
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl font-medium leading-relaxed">
                            Lên lịch học, chia nhỏ bài tập, tập trung với đồng hồ Pomodoro. EduFlow giúp bạn tổ chức việc học một cách khoa học và hiệu quả.
                        </p>

                    </motion.div>
                </div>
            </div>

            {/* Màn hình lưới tối */}
            <div className="flex-1 bg-slate-950 text-white px-10 py-16">

                {/* Nút thể loại */}
                <div className="flex flex-wrap items-center gap-3 mb-12 border-b border-slate-800 pb-8">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all border ${activeTab === category
                                ? 'bg-white text-slate-950 border-white shadow-lg'
                                : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Lưới hành động nhanh */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
                    <QuickActionCard
                        icon={<Users className="h-8 w-8 text-white" />}
                        title="Thêm Bạn"
                        desc="Tìm bạn học phù hợp"
                        href="/stms/student/matching"
                        gradient="from-primary-500 to-primary-600"
                    />
                    <QuickActionCard
                        icon={<Play className="h-8 w-8 text-white" />}
                        title="Phòng Học"
                        desc="Tham gia phòng học nhóm"
                        href="/stms/student/room"
                        gradient="from-primary-500 to-primary-600"
                    />
                </div>

                {/* Hộp thoại hướng dẫn */}
                <OnboardingDialog open={onboardingOpen} setOpen={handleCloseOnboarding} />

                {/* Tiêu đề lưới */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black flex items-center">
                        <GraduationCap className="mr-3 text-primary-400" size={28} />
                        Tài liệu tham khảo
                    </h2>
                </div>

                {/* Lưới card */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredSubjects.map((subject, index) => (
                            <motion.div
                                key={subject.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="group cursor-pointer flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden hover:bg-slate-800 transition-colors border border-slate-800/50 hover:border-slate-700 shadow-xl"
                                onClick={() => navigate(`/stms/student/material/${subject.id}`, { state: { subject } })}
                            >
                                {/* Ảnh bìa */}
                                <div className="h-44 w-full relative overflow-hidden">
                                    <img
                                        src={getSubjectMaterial(subject.id).coverImage}
                                        alt={subject.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Lớp phủ tối */}
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                                    {/* Lớp phủ đọc khi hover */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                                            <BookOpen strokeWidth={2.5} size={24} />
                                        </div>
                                    </div>
                                </div>

                                {/* Nội dung */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                                        {subject.author}
                                    </p>
                                    <h3 className="font-bold text-lg leading-snug mb-3 group-hover:text-primary-400 transition-colors line-clamp-2">
                                        {subject.title}
                                    </h3>
                                    <div className="mt-auto flex items-center text-slate-400 text-xs font-medium">
                                        <BookOpen size={13} className="mr-1.5" />
                                        {subject.duration}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredSubjects.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Môn học trống...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
