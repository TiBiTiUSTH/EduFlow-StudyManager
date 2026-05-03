import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, BookOpen, Clock, FileText, CheckCircle2, PlayCircle } from 'lucide-react';
import { getSubjectMaterial } from '../../data/subjectMaterials';

const StudyMaterialPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();


    const subject = location.state?.subject || {
        title: 'Tài liệu tham khảo',
        author: 'EduFlow System',
        duration: 'Nhiều chủ đề',
        category: 'Tài Liệu'
    };

    const curriculum = React.useMemo(() => getSubjectMaterial(id), [id]);

    const [activeLessonId, setActiveLessonId] = useState(() => {
        const c = getSubjectMaterial(id);
        return c.chapters[0]?.lessons[0]?.id || '';
    });

    useEffect(() => {
        const firstId = curriculum.chapters[0]?.lessons[0]?.id || '';
        setActiveLessonId(firstId);
    }, [id]);

    const allLessons = React.useMemo(() => curriculum.chapters.flatMap(c => c.lessons), [curriculum]);
    const currentLesson = allLessons.find(l => l.id === activeLessonId);

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 flex flex-col font-sans -mt-8 -mx-8">

            {/* Màn hình chính */}
            <div className="relative h-64 shrink-0 bg-slate-900 overflow-hidden group">
                <img
                    src={curriculum.coverImage}
                    alt="Cover"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                {/* Điều hướng */}
                <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
                    <button
                        onClick={() => navigate('/stms/student')}
                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors text-white"
                        title="Quay lại Tổng quan"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-widest border border-white/20">
                        {subject.category}
                    </div>
                </div>

                {/* Thông tin tiêu đề */}
                <div className="absolute bottom-6 left-6 md:left-12 max-w-3xl z-20">
                    <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3 tracking-tight">
                        {subject.title}
                    </h1>
                    <p className="text-slate-300 text-sm md:text-base font-medium line-clamp-2 max-w-2xl">
                        {curriculum.description}
                    </p>
                </div>
            </div>

            {/* KHU VỰC NỘI DUNG CHÍNH */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Thanh bên trái (Mục lục) */}
                <div className="w-80 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-shrink-0 hidden lg:flex flex-col h-[calc(100vh-16rem)] overflow-y-auto hidden-scrollbar z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                    <div className="p-6">
                        <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Lộ trình học tập</h3>

                        <div className="space-y-6">
                            {curriculum.chapters.map(chapter => (
                                <div key={chapter.id}>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">{chapter.title}</h4>
                                    <div className="space-y-1 pl-3 border-l-2 border-slate-100 dark:border-slate-700">
                                        {chapter.lessons.map(lesson => (
                                            <button
                                                key={lesson.id}
                                                onClick={() => setActiveLessonId(lesson.id)}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${activeLessonId === lesson.id
                                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-sm border border-primary-100/50 dark:border-primary-800'
                                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                                    }`}
                                            >
                                                <span className="truncate pr-2">{lesson.title}</span>
                                                {activeLessonId === lesson.id ? (
                                                    <PlayCircle size={16} className="text-primary-500 fill-primary-100 flex-shrink-0" />
                                                ) : (
                                                    <CheckCircle2 size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* NỘI DUNG */}
                <div className="flex-1 bg-[#fafafa] dark:bg-slate-950 h-[calc(100vh-16rem)] overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-8 md:px-16 py-12">

                        {currentLesson ? (
                            <>
                                {/* Tiêu đề */}
                                <div className="mb-12 border-b border-slate-200 dark:border-slate-700 pb-8">
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
                                        {currentLesson.title}
                                    </h2>

                                </div>

                                {/* Nội dung động */}
                                <div
                                    className="prose prose-slate dark:prose-invert prose-lg max-w-none text-slate-700 dark:text-slate-300 marker:text-primary-500 prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary-600 hover:prose-a:text-primary-500"
                                    dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                                />
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-slate-500">Đang tải nội dung...</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyMaterialPage;
