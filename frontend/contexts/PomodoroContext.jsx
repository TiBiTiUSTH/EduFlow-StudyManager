import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, CheckCircle2, Coffee, Target, X } from 'lucide-react';


const PomodoroContext = createContext();

export const usePomodoro = () => useContext(PomodoroContext);

const API = 'http://127.0.0.1:8000';
const DEFAULT_SOUND = '/sounds/pomodoro.mp3';

// Helper to get pending tasks for Pomodoro sync
const fetchPendingTasks = async (headers) => {
    try {
        const res = await axios.get(`${API}/stms/tasks/`, { headers });
        // Filter only non-completed tasks
        return (res.data || []).filter(t => t.status !== 'completed');
    } catch {
        return [];
    }
};

export const PomodoroProvider = ({ children }) => {
    // ---- Modes ----
    const [customWork, setCustomWork] = useState(25);
    const [customBreak, setCustomBreak] = useState(5);

    const MODES = {
        work: { time: customWork, label: 'Tập trung', color: 'text-primary-500', bg: 'bg-primary-500', border: 'border-primary-500' },
        shortBreak: { time: customBreak, label: 'Nghỉ ngơi', color: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500' },
    };

    const [mode, setMode] = useState('work');
    const [minutes, setMinutes] = useState(MODES[mode].time);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    // ---- Task Sync ----
    const [selectedTask, setSelectedTask] = useState(null); // { id, title, ... }
    const [pendingTasks, setPendingTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(false);

    // ---- Stats ---
    const [stats, setStats] = useState({ today_sessions: 0, weekly_sessions: 0, total_focus_hours: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    // ---- Alarm Popup ----
    const [showAlarmPopup, setShowAlarmPopup] = useState(false);
    const [lastCompletedMode, setLastCompletedMode] = useState('');

    // ---- Audio ----
    const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
    const [customSoundName, setCustomSoundName] = useState(() => localStorage.getItem('pomodoro_sound_name') || '');
    const [customSoundUrl, setCustomSoundUrl] = useState(() => localStorage.getItem('pomodoro_sound_url') || '');

    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        if (token) {
            fetchStats();
            loadTasks();
        } else {
            setLoadingStats(false);
        }
    }, [token]);

    const loadTasks = async () => {
        setLoadingTasks(true);
        const tasks = await fetchPendingTasks(headers);
        setPendingTasks(tasks);
        setLoadingTasks(false);
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API}/stms/pomodoros/stats`, { headers });
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch stats', err);
        } finally {
            setLoadingStats(false);
        }
    };

    const saveSession = async () => {
        if (!token) return;
        try {
            await axios.post(`${API}/stms/pomodoros/`, {
                work_duration: MODES.work.time,
                break_duration: MODES.shortBreak.time,
                completed_pomodoros: 1,
                total_focus_time: MODES.work.time,
                task_id: selectedTask?.id || null
            }, { headers });
            fetchStats();
            // Refresh tasks list to update actual_duration etc.
            loadTasks();
        } catch (err) {
            console.error('Failed to save pomodoro', err);
        }
    };

    // Show native browser notification when timer is done
    const showNotification = (title, body) => {
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                new Notification(title, { body, icon: '/favicon.ico' });
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        new Notification(title, { body, icon: '/favicon.ico' });
                    }
                });
            }
        }
    };

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                } else if (minutes > 0) {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                } else {
                    handleTimerComplete();
                }
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, minutes, seconds]);

    useEffect(() => {
        // Request notification permission early
        if ("Notification" in window && Notification.permission !== "denied" && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    const getAudioSrc = () => {
        return customSoundUrl || DEFAULT_SOUND;
    };

    const playAlarm = () => {
        try {
            const audio = new Audio(getAudioSrc());
            audio.loop = false;
            audioRef.current = audio;
            audio.play().then(() => {
                setIsAlarmPlaying(true);
            }).catch(() => { });
            audio.onended = () => {
                setIsAlarmPlaying(false);
                audioRef.current = null;
            };
        } catch {
            // Fallback: silently ignore
        }
    };

    const stopAlarm = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setIsAlarmPlaying(false);
    };

    const handleTimerComplete = () => {
        setIsActive(false);
        playAlarm();
        setLastCompletedMode(mode);
        setShowAlarmPopup(true);

        if (mode === 'work') {
            saveSession();
            showNotification("Đã xong một phiên!", "Đến giờ nghỉ ngơi rồi. Chuyển sang chế độ nghỉ ngơi.");
            switchMode('shortBreak');
        } else {
            showNotification("Hết giờ nghỉ!", "Bắt đầu làm việc lại nào!");
            switchMode('work');
        }
    };

    const handleClosePopup = () => {
        stopAlarm();
        setShowAlarmPopup(false);
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        stopAlarm();
        setMinutes(MODES[mode].time);
        setSeconds(0);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setMinutes(MODES[newMode].time);
        setSeconds(0);
    };

    // Calculate progress
    const totalSeconds = MODES[mode].time * 60;
    const currentSeconds = minutes * 60 + seconds;
    const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

    const value = {
        MODES,
        mode,
        switchMode,
        minutes,
        setMinutes,
        seconds,
        setSeconds,
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
        // Task sync
        selectedTask,
        setSelectedTask,
        pendingTasks,
        loadingTasks
    };

    return (
        <PomodoroContext.Provider value={value}>
            {children}

            {/* Popup thông báo */}
            <AnimatePresence>
                {showAlarmPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center border-2 overflow-hidden"
                            style={{
                                borderColor: lastCompletedMode === 'work' ? '#10b981' : '#3b82f6'
                            }}
                        >
                            {/* Hình trang trí */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-slate-50 -z-10 rounded-t-3xl border-b border-slate-100"></div>

                            <button
                                onClick={handleClosePopup}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex justify-center mb-6 relative">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center relative ${lastCompletedMode === 'work' ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'}`}>
                                    {lastCompletedMode === 'work' ? <CheckCircle2 size={40} /> : <Coffee size={40} />}

                                    {/* Hiệu ứng rung chuông */}
                                    {isAlarmPlaying && (
                                        <div className="absolute -inset-2 border-2 border-[currentColor] rounded-full animate-ping opacity-20"></div>
                                    )}
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 mb-2">
                                {lastCompletedMode === 'work' ? 'Tuyệt vời!' : 'Hết giờ nghỉ!'}
                            </h2>
                            <p className="text-slate-500 mb-8 font-medium text-sm">
                                {lastCompletedMode === 'work'
                                    ? 'Bạn vừa hoàn thành một phiên tập trung. Hãy đứng lên vận động và uống một ngụm nước nhé.'
                                    : 'Thời gian nghỉ ngơi đã hết. Đã đến lúc quay lại với công việc.'}
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={handleClosePopup}
                                    className={`w-full font-bold py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 ${lastCompletedMode === 'work'
                                            ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200'
                                            : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-200'
                                        }`}
                                >
                                    <BellRing size={18} className={isAlarmPlaying ? 'animate-bounce' : ''} />
                                    {isAlarmPlaying ? 'Tắt chuông & Tiếp tục' : 'Tiếp tục'}
                                </button>

                                <button
                                    onClick={() => {
                                        handleClosePopup();
                                        toggleTimer();
                                    }}
                                    className="w-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-bold py-3.5 rounded-xl transition-all text-sm"
                                >
                                    {lastCompletedMode === 'work' ? 'Bắt đầu nghỉ ngơi luôn' : 'Bắt đầu làm việc luôn'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PomodoroContext.Provider>
    );
};
