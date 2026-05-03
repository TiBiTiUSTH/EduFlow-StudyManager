import React from 'react';
import PomodoroTimer from '../../components/UI/PomodoroTimer';
import { MessageSquare, Target, X, Loader2, CheckCircle2 } from 'lucide-react';
import { usePomodoro } from '../../contexts/PomodoroContext';

const PomodoroPage = () => {
    const { selectedTask, setSelectedTask, pendingTasks, loadingTasks, isActive } = usePomodoro();

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Đồng hồ Pomodoro</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                <div className="lg:col-span-3">
                    <PomodoroTimer />
                </div>

                <div className="lg:col-span-2 space-y-8">
                    {/* Bảng đồng bộ nhiệm vụ */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-lg">
                        <h3 className="font-bold text-base mb-4 flex items-center text-slate-900 dark:text-white">
                            <Target size={18} className="mr-2 text-primary-500" /> Đồng bộ với nhiệm vụ
                        </h3>

                        {/* Nhiệm vụ đang chọn */}
                        {selectedTask ? (
                            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-4 mb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-primary-500 uppercase tracking-wider mb-1">Đang tập trung cho</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{selectedTask.title}</p>
                                        {selectedTask.priority && (
                                            <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-bold rounded-full ${selectedTask.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                selectedTask.priority === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                                                    'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                }`}>
                                                {selectedTask.priority === 'high' ? 'Ưu tiên cao' : selectedTask.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                            </span>
                                        )}
                                    </div>
                                    {!isActive && (
                                        <button
                                            onClick={() => setSelectedTask(null)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all flex-shrink-0"
                                            title="Bỏ chọn task"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 dark:bg-slate-700/50 border border-dashed border-slate-200 dark:border-slate-600 rounded-2xl p-4 mb-4 text-center">
                                <p className="text-sm text-slate-400 font-medium">Nhiệm vụ trống</p>
                                <p className="text-xs text-slate-300 dark:text-slate-500 mt-1">Không có nhiệm vụ nào. Hãy thêm một nhiệm vụ bên dưới.</p>
                            </div>
                        )}

                        {/* Danh sách nhiệm vụ */}
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                            {loadingTasks ? (
                                <div className="flex justify-center py-6">
                                    <Loader2 className="animate-spin text-slate-300" size={24} />
                                </div>
                            ) : pendingTasks.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-4"></p>
                            ) : (
                                pendingTasks.map(task => (
                                    <button
                                        key={task.id}
                                        disabled={isActive}
                                        onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 border ${selectedTask?.id === task.id
                                            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
                                            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-700 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
                                            } ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedTask?.id === task.id
                                            ? 'border-primary-500 bg-primary-500'
                                            : 'border-slate-300 dark:border-slate-500'
                                            }`}>
                                            {selectedTask?.id === task.id && (
                                                <CheckCircle2 size={12} className="text-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-semibold truncate ${selectedTask?.id === task.id ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-200'
                                                }`}>
                                                {task.title}
                                            </p>
                                        </div>
                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'high' ? 'bg-red-400' :
                                            task.priority === 'medium' ? 'bg-amber-400' : 'bg-green-400'
                                            }`} />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Tips */}
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
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                Chọn nhiệm vụ cụ thể.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PomodoroPage;
