import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PomodoroTimer = () => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work'); // work, shortBreak, longBreak

    const timerRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                } else if (minutes > 0) {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                } else {
                    // Timer finished
                    handleTimerComplete();
                }
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, minutes, seconds]);

    const handleTimerComplete = () => {
        setIsActive(false);
        // Play notification sound if possible
        new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => { });

        if (mode === 'work') {
            alert('Tới giờ nghỉ ngơi rồi! Bạn đã làm việc rất chăm chỉ.');
            switchMode('shortBreak');
        } else {
            alert('Hết giờ nghỉ! Sẵn sàng quay lại học tập chưa?');
            switchMode('work');
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'work') setMinutes(25);
        else if (mode === 'shortBreak') setMinutes(5);
        else setMinutes(15);
        setSeconds(0);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        if (newMode === 'work') setMinutes(25);
        else if (newMode === 'shortBreak') setMinutes(5);
        else setMinutes(15);
        setSeconds(0);
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-12 bg-white rounded-[40px] border border-slate-100 shadow-2xl relative overflow-hidden">
            {/* Decorative background */}
            <div className={`absolute top-0 left-0 w-full h-2 transition-all duration-500 ${mode === 'work' ? 'bg-primary-500' : 'bg-green-500'
                }`} />

            <div className="flex bg-slate-100 p-1.5 rounded-2xl space-x-1">
                <button
                    onClick={() => switchMode('work')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'work' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Học tập
                </button>
                <button
                    onClick={() => switchMode('shortBreak')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'shortBreak' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Nghỉ ngắn
                </button>
                <button
                    onClick={() => switchMode('longBreak')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'longBreak' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Nghỉ dài
                </button>
            </div>

            <div className="relative">
                <svg className="w-64 h-64 transform -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-100"
                    />
                    <motion.circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={754}
                        animate={{
                            strokeDashoffset: 754 - (754 * (minutes * 60 + seconds)) / (mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60)
                        }}
                        className={mode === 'work' ? 'text-primary-500' : 'text-green-500'}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black text-slate-900 tracking-tighter">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">
                        {mode === 'work' ? 'Tập trung' : 'Nghỉ ngơi'}
                    </span>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetTimer}
                    className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all"
                >
                    <RotateCcw size={24} />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTimer}
                    className={`px-12 py-4 rounded-2xl text-white font-black text-lg shadow-xl flex items-center space-x-3 transition-all ${mode === 'work'
                            ? 'bg-primary-500 shadow-primary-200 hover:bg-primary-600'
                            : 'bg-green-500 shadow-green-200 hover:bg-green-600'
                        }`}
                >
                    {isActive ? <Pause size={24} /> : <Play size={24} />}
                    <span>{isActive ? 'Tạm dừng' : 'Bắt đầu'}</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all"
                >
                    <BellRing size={24} />
                </motion.button>
            </div>

            <div className="w-full pt-8 border-t border-slate-50 flex justify-around">
                <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">0</p>
                    <p className="text-xs text-slate-400">Hôm nay</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">12</p>
                    <p className="text-xs text-slate-400">Tuần này</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">45h</p>
                    <p className="text-xs text-slate-400">Tổng cộng</p>
                </div>
            </div>
        </div>
    );
};

export default PomodoroTimer;
