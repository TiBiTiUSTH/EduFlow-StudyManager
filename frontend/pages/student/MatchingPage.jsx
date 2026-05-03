import React, { useState, useEffect } from 'react';
import { UserPlus, X, RefreshCw, Star, BookOpen, GraduationCap, School } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/UI/Toast';
import axios from 'axios';

const MatchingPage = () => {
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    const { addToast } = useToast();
    const [suggestions, setSuggestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [swipingDir, setSwipingDir] = useState(null);

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Fetch từ proxy matching trong backend
            const res = await axios.get('http://127.0.0.1:8000/matching/suggestions', config);
            setSuggestions(res.data);
            setCurrentIndex(0);
        } catch (error) {
            console.error('Lỗi khi tải gợi ý bạn học:', error);
            addToast({
                title: 'Lỗi',
                message: 'Không thể kết nối máy chủ gợi ý. Vui lòng thử lại sau.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSwipe = async (dir, targetUserId) => {
        setSwipingDir(dir);
        setTimeout(() => {
            if (dir === 'right') {
                sendBuddyRequest(targetUserId);
            }
            setCurrentIndex(prev => prev + 1);
            setSwipingDir(null);
        }, 300);
    };

    const sendBuddyRequest = async (targetId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`http://127.0.0.1:8000/api/buddies/request/${targetId}`, null, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    sender_id: user.id,
                    message: "Chào bạn, mình thấy hợp môn nên muốn học chung!"
                }
            });
            addToast({
                title: 'Thành công',
                message: 'Đã gửi lời mời kết bạn!',
                type: 'success'
            });
        } catch (error) {
            console.error('Lỗi gửi kết bạn:', error);
            addToast({
                title: 'Lỗi',
                message: error.response?.data?.detail || 'Không thể gửi lời mời.',
                type: 'error'
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
                <span className="ml-3 text-gray-500 dark:text-slate-400 font-medium">Đang Load...</span>
            </div>
        );
    }

    if (suggestions.length === 0 || currentIndex >= suggestions.length) {
        return (
            <div className="flex flex-col justify-center items-center h-full text-center p-6 bg-gray-50 dark:bg-slate-950">
                <div className="w-24 h-24 bg-gray-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                    <UserPlus className="h-10 w-10 text-gray-400 dark:text-slate-500" />
                </div>

                <button
                    onClick={fetchSuggestions}
                    className="px-6 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition"
                >
                    Tìm bạn
                </button>
            </div>
        );
    }

    const currentProfile = suggestions[currentIndex];

    // Class hiển thị thẻ  
    let cardClass = "max-w-sm w-full bg-white dark:bg-slate-900/90 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 transform relative backdrop-blur-md border border-white/20 dark:border-slate-800/50";
    if (swipingDir === 'left') {
        cardClass += " -translate-x-full -rotate-12 opacity-0";
    } else if (swipingDir === 'right') {
        cardClass += " translate-x-full rotate-12 opacity-0";
    } else {
        cardClass += " translate-x-0 rotate-0 opacity-100 scale-100 hover:scale-[1.02]";
    }

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-slate-950 items-center justify-center py-10 px-4">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                    Tìm Bạn
                </h1>
            </div>

            {/* Profile Card */}
            <div className={cardClass}>
                {/* Score Badge */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-emerald-600 dark:text-emerald-400 shadow-sm flex items-center gap-1 z-10 border border-emerald-100 dark:border-emerald-900/50">
                    <Star className="h-4 w-4 fill-emerald-500 dark:fill-emerald-400 text-emerald-500 dark:text-emerald-400" />
                    Match {Math.round(currentProfile.similarity_score * 100)}%
                </div>

                {/* Biểu ngữ hình đại diện */}
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 relative">
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                        {currentProfile.avatar_url ? (
                            <img
                                src={currentProfile.avatar_url}
                                alt={currentProfile.name}
                                className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 shadow-md object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 shadow-md bg-white dark:bg-slate-800 flex items-center justify-center text-primary-500 dark:text-primary-400 text-3xl font-bold">
                                {currentProfile.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Thông tin cá nhân */}
                <div className="pt-16 pb-8 px-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{currentProfile.name}</h2>
                    {currentProfile.school_name && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-1 mb-2">
                            <School className="h-4 w-4" />
                            {currentProfile.school_name}
                        </p>
                    )}

                    <div className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 font-medium mb-6 bg-primary-50 dark:bg-primary-900/30 w-fit mx-auto px-3 py-1.5 rounded-lg">
                        <GraduationCap className="h-5 w-5" />
                        <span>{currentProfile.grade_level || "Chưa cập nhật"}</span>
                    </div>

                    <div className="space-y-4 text-left border-t border-gray-100 dark:border-slate-800 pt-5">
                        <div>
                            <span className="text-xs font-bold tracking-wider text-gray-400 dark:text-slate-500 uppercase">Môn học chung</span>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {currentProfile.matched_subjects?.length > 0 ? (
                                    currentProfile.matched_subjects.map((sub, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
                                            <BookOpen className="h-4 w-4" />
                                            {sub}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-gray-500 dark:text-slate-500">Chưa có môn học chung</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NÚT CHỨC NĂNG */}
            <div className="flex gap-6 mt-10">
                <button
                    onClick={() => handleSwipe('left', currentProfile.user_id)}
                    disabled={swipingDir !== null}
                    className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 text-gray-400 dark:text-slate-400 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none disabled:opacity-50"
                >
                    <X className="h-8 w-8" />
                </button>
                <button
                    onClick={() => handleSwipe('right', currentProfile.user_id)}
                    disabled={swipingDir !== null}
                    className="w-16 h-16 rounded-full bg-primary-500 dark:bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/50 flex items-center justify-center hover:bg-primary-600 dark:hover:bg-primary-500 hover:scale-105 transition-all focus:outline-none disabled:opacity-50"
                >
                    <UserPlus className="h-7 w-7" />
                </button>
            </div>


        </div>
    );
};

export default MatchingPage;
