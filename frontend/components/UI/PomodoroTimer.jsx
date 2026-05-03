import React, { useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Brain, BellRing, BellOff, Target, Loader2, Settings2, X, Check, Upload, Music, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePomodoro } from '../../contexts/PomodoroContext';

const MAX_AUDIO_DURATION = 30;

const PomodoroTimer = () => {
    const {
        MODES,
        mode,
        switchMode,
        minutes,
        seconds,
        isActive,
        toggleTimer,
        resetTimer,
        customWork,
        setCustomWork,
        customBreak,
        setCustomBreak,
        stats,
        loadingStats,
        isAlarmPlaying,
        playAlarm,
        stopAlarm,
        customSoundName,
        setCustomSoundName,
        customSoundUrl,
        setCustomSoundUrl,
        progress,
        setMinutes
    } = usePomodoro();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSoundPanelOpen, setIsSoundPanelOpen] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef(null);
    const handleSoundUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadError('');

        if (!file.type.startsWith('audio/')) {
            setUploadError('Chỉ chấp nhận file âm thanh (mp3, wav, ogg...)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File quá lớn, tối đa 5MB');
            return;
        }
        const tempAudio = new Audio();
        const objectUrl = URL.createObjectURL(file);
        tempAudio.src = objectUrl;

        tempAudio.onloadedmetadata = () => {
            URL.revokeObjectURL(objectUrl);
            if (tempAudio.duration > MAX_AUDIO_DURATION) {
                setUploadError(`File quá dài!, tối đa ${MAX_AUDIO_DURATION} giây`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target.result;
                try {
                    localStorage.setItem('pomodoro_sound_url', dataUrl);
                    localStorage.setItem('pomodoro_sound_name', file.name);
                    setCustomSoundUrl(dataUrl);
                    setCustomSoundName(file.name);
                    setUploadError('');
                } catch {
                    setUploadError('File nặng. Thử file nhẹ hơn.');
                }
            };
            reader.readAsDataURL(file);
        };

        tempAudio.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            setUploadError('Lỗi đọc file âm thanh.');
        };

        e.target.value = '';
    };

    const removeCustomSound = () => {
        localStorage.removeItem('pomodoro_sound_url');
        localStorage.removeItem('pomodoro_sound_name');
        setCustomSoundUrl('');
        setCustomSoundName('');
        setUploadError('');
    };

    const previewSound = () => {
        stopAlarm();
        playAlarm();
    };

    const applySettings = (e) => {
        e.preventDefault();
        setIsSettingsOpen(false);
        setMinutes(MODES[mode].time);

        resetTimer();
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-12 bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-xl relative overflow-hidden">
            {/* Hiển thị border ở trên */}
            <div className={`absolute top-0 left-0 w-full h-2 transition-all duration-500 ${MODES[mode].bg}`} />

            {/*Bộ chọn chế độ */}
            <div className="flex bg-slate-50 dark:bg-slate-700 p-1.5 rounded-2xl space-x-1 border border-slate-100 dark:border-slate-600 relative">
                {Object.entries(MODES).map(([key, val]) => (
                    <button
                        key={key}
                        onClick={() => switchMode(key)}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === key ? `bg-white dark:bg-slate-600 ${val.color} shadow-sm border border-slate-100 dark:border-slate-500` : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                            }`}
                    >
                        {val.label}
                    </button>
                ))}

                <button
                    onClick={() => { setIsSettingsOpen(true); setIsSoundPanelOpen(false); }}
                    className="ml-2 p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
                    title="Cài đặt"
                >
                    <Settings2 size={18} />
                </button>
            </div>

            {/* Cài đặt */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-16 z-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-2xl rounded-3xl p-6 w-80"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold text-slate-900 dark:text-white">Cài đặt thời gian</h3>
                            <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-red-500">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={applySettings} className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-600 dark:text-slate-300">Tập trung (phút)</label>
                                <input
                                    type="number" min="1" max="120"
                                    value={customWork} onChange={(e) => setCustomWork(Number(e.target.value))}
                                    className="w-20 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-1.5 text-center font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary-500/20"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-600 dark:text-slate-300">Nghỉ ngơi (phút)</label>
                                <input
                                    type="number" min="1" max="60"
                                    value={customBreak} onChange={(e) => setCustomBreak(Number(e.target.value))}
                                    className="w-20 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-1.5 text-center font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary-500/20"
                                />
                            </div>
                            <button type="submit" className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-all flex justify-center items-center gap-2">
                                <Check size={16} /> Lưu
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bảng điều khiển âm thanh*/}
            <AnimatePresence>
                {isSoundPanelOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-16 z-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-2xl rounded-3xl p-6 w-80"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <BellRing size={18} className="text-primary-500" /> Âm thanh thông báo
                            </h3>
                            <button onClick={() => setIsSoundPanelOpen(false)} className="text-slate-400 hover:text-red-500">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Âm thanh hiện tại */}
                        <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-4 mb-4 border border-slate-100 dark:border-slate-600">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Đang dùng</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Music size={18} className="text-primary-600 dark:text-primary-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                                        {customSoundName || 'Mặc định'}
                                    </p>
                                    <p className="text-xs text-slate-400">{customSoundUrl ? 'Tùy chỉnh' : 'Hệ thống'}</p>
                                </div>
                                <button
                                    onClick={previewSound}
                                    className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all flex-shrink-0"
                                    title="Nghe thử"
                                >
                                    <Play size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Tải lên */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="audio/*"
                            onChange={handleSoundUpload}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-600 hover:border-primary-300 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-2xl transition-all flex justify-center items-center gap-2 text-sm"
                        >
                            <Upload size={16} /> Tải lên âm thanh mới
                        </button>
                        <p className="text-xs text-slate-400 text-center mt-2">
                            Chấp nhận MP3, WAV, OGG • Tối đa {MAX_AUDIO_DURATION}s • 5MB
                        </p>

                        {/* Lỗi */}
                        {uploadError && (
                            <div className="mt-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold p-3 rounded-xl border border-red-100 dark:border-red-800">
                                {uploadError}
                            </div>
                        )}

                        {/* Xóa âm thanh tùy chỉnh */}
                        {customSoundUrl && (
                            <button
                                onClick={removeCustomSound}
                                className="w-full mt-3 text-red-500 hover:text-red-700 dark:hover:text-red-300 font-bold py-2 rounded-xl transition-all flex justify-center items-center gap-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <Trash2 size={14} /> Xóa và dùng âm thanh mặc định
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Vòng tròn hẹn giờ */}
            <div className="relative">
                <svg className="w-72 h-72 transform -rotate-90">
                    {/* Vòng tròn nền */}
                    <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50 dark:text-slate-700" />
                    {/* Vòng tròn tiến độ */}
                    <motion.circle
                        cx="144"
                        cy="144"
                        r="130"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={816}
                        animate={{ strokeDashoffset: 816 - (816 * progress) / 100 }}
                        className={MODES[mode].color}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                    <span className={`text-sm font-bold uppercase tracking-widest mt-2 ${MODES[mode].color}`}>
                        {MODES[mode].label}
                    </span>
                </div>
            </div>

            {/* Điều khiển */}
            <div className="flex items-center space-x-4">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={resetTimer} className="p-4 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-all border border-slate-100 dark:border-slate-600" title="Đặt lại">
                    <RotateCcw size={24} />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTimer}
                    className={`px-12 py-4 rounded-2xl text-white font-black text-lg shadow-xl flex items-center space-x-3 transition-colors ${MODES[mode].bg} hover:opacity-90`}
                >
                    {isActive ? <Pause size={24} /> : <Play size={24} />}
                    <span>{isActive ? 'Tạm dừng' : 'Bắt đầu'}</span>
                </motion.button>

                {/* Nút chuông / Dừng chuông */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={isAlarmPlaying ? stopAlarm : () => { setIsSoundPanelOpen(!isSoundPanelOpen); setIsSettingsOpen(false); }}
                    className={`p-4 rounded-2xl transition-all border ${isAlarmPlaying
                        ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-lg shadow-red-200'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 border-slate-100 dark:border-slate-600'
                        }`}
                    title={isAlarmPlaying ? 'Tắt chuông' : 'Cài đặt âm thanh'}
                >
                    {isAlarmPlaying ? <BellOff size={24} /> : <BellRing size={24} />}
                </motion.button>
            </div>

            {/* Thống kê thực tế */}
            <div className="w-full pt-8 border-t border-slate-50 dark:border-slate-700 flex justify-around">
                {loadingStats ? (
                    <div className="flex justify-center w-full py-4"><Loader2 className="animate-spin text-slate-300" /></div>
                ) : (
                    <>
                        <div className="text-center group">
                            <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{stats.today_sessions}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Hoàn thành / Hôm nay</p>
                        </div>
                        <div className="text-center border-l border-slate-100 dark:border-slate-700 pl-8 group">
                            <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{stats.weekly_sessions}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Hoàn thành / Tuần</p>
                        </div>
                        <div className="text-center border-l border-slate-100 dark:border-slate-700 pl-8 group">
                            <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{stats.total_focus_hours}h</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Tổng giờ học</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PomodoroTimer;
