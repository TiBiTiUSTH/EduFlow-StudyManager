import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const icons = {
    success: { icon: CheckCircle2, bg: 'bg-green-500', ring: 'ring-green-100' },
    error: { icon: AlertTriangle, bg: 'bg-red-500', ring: 'ring-red-100' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-500', ring: 'ring-amber-100' },
    info: { icon: Info, bg: 'bg-primary-500', ring: 'ring-primary-100' },
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }, []);

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <ToastContext.Provider value={addToast}>
            {children}
            <div className="fixed top-6 right-6 z-[200] space-y-2 max-w-sm">
                <AnimatePresence>
                    {toasts.map(toast => {
                        const config = icons[toast.type] || icons.info;
                        const Icon = config.icon;
                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 60, scale: 0.9 }}
                                className={`flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 ring-2 ${config.ring}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg} text-white shrink-0`}>
                                    <Icon size={16} />
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-200 font-medium flex-1">{toast.message}</p>
                                <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0">
                                    <X size={14} />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
