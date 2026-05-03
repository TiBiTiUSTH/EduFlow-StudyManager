import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Xác nhận', cancelText = 'Hủy', type = 'danger' }) => {
    if (!isOpen) return null;

    const colors = {
        danger: { icon: 'bg-red-100 text-red-600', btn: 'bg-red-600 hover:bg-red-700 shadow-red-200' },
        warning: { icon: 'bg-amber-100 text-amber-600', btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' },
        info: { icon: 'bg-primary-100 text-primary-600', btn: 'bg-primary-600 hover:bg-primary-700 shadow-primary-200' },
    };
    const c = colors[type] || colors.danger;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-slate-800 dark:text-white rounded-[24px] w-full max-w-sm p-6 relative z-10 shadow-2xl transition-colors">
                    <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
                            <AlertTriangle size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{message}</p>
                        </div>
                        <button onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="flex gap-2.5 mt-5">
                        <button onClick={onCancel}
                            className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-sm">
                            {cancelText}
                        </button>
                        <button onClick={onConfirm}
                            className={`flex-1 py-2.5 text-white font-bold rounded-xl shadow-lg transition-all text-sm ${c.btn}`}>
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmDialog;
