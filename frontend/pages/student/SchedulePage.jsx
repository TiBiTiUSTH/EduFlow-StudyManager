import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Trash2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import { useToast } from '../../components/UI/Toast';

const API = 'http://127.0.0.1:8000';
const VI_MONTHS = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

const fmtTime = (iso) => iso ? new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';
const toLocalDate = (iso) => iso ? iso.split('T')[0] : '';

const SchedulePage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });
    const toast = useToast();

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const [form, setForm] = useState({
        title: '',
        description: '',
        subject_id: '',
        start_time: '',
        end_time: '',
        location: '',
    });

    // Lấy dữ liệu
    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [schRes, subRes] = await Promise.allSettled([
                axios.get(`${API}/stms/schedules/`, { headers }),
                axios.get(`${API}/stms/subjects/`, { headers }),
            ]);
            if (schRes.status === 'fulfilled') setSchedules(schRes.value.data);
            if (subRes.status === 'fulfilled') setSubjects(subRes.value.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Lịch
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const scheduleDates = schedules.reduce((acc, s) => {
        const d = toLocalDate(s.start_time);
        if (!acc[d]) acc[d] = [];
        acc[d].push(s);
        return acc;
    }, {});

    // Ngày hôm nay
    const todaySchedules = schedules
        .filter(s => toLocalDate(s.start_time) === todayStr)
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    // Lịch đã chọn
    const selectedDaySchedules = selectedDay
        ? (scheduleDates[selectedDay] || []).sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        : todaySchedules;

    const displayDate = selectedDay || todayStr;

    // Màu subject
    const getSubjectColor = (subjectId) => {
        const sub = subjects.find(s => s.id === subjectId);
        return sub?.color_code || '#3b82f6';
    };
    const getSubjectName = (subjectId) => {
        const sub = subjects.find(s => s.id === subjectId);
        return sub?.subject_name || null;
    };

    // Handlers
    const openModal = (dateStr = null) => {
        const base = dateStr || todayStr;
        setForm({
            title: '',
            description: '',
            subject_id: null,
            start_time: `${base}T08:00`,
            end_time: `${base}T09:30`,
            custom_subject: '',
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.post(`${API}/stms/schedules/`, {
                ...form,
                subject_id: null,
                start_time: new Date(form.start_time).toISOString(),
                end_time: new Date(form.end_time).toISOString(),
            }, { headers });
            setIsModalOpen(false);
            fetchAll();
        } catch (err) {
            toast(err.response?.data?.detail || 'Lỗi', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        setConfirmDialog({
            open: true,
            title: 'Xóa lịch học',
            message: 'Bạn có muốn xóa lịch học ?',
            onConfirm: async () => {
                setConfirmDialog(d => ({ ...d, open: false }));
                try {
                    await axios.delete(`${API}/stms/schedules/${id}`, { headers });
                    fetchAll();
                    toast('Đã xóa lịch học', 'success');
                } catch (err) {
                    console.error(err);
                    toast('Lỗi xóa lịch học', 'error');
                }
            }
        });
    };

    return (
        <>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Lịch học</h1>

                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-primary-600 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all font-bold"
                    >
                        <Plus size={20} />
                        <span>Thêm lịch mới</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lịch */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                        {/* Tháng */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{VI_MONTHS[month]}, {year}</h2>
                            <div className="flex space-x-2">
                                <button onClick={prevMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => { setCurrentDate(new Date()); setSelectedDay(todayStr); }}
                                    className="px-3 py-1 text-xs font-bold text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                                >
                                    Hôm nay
                                </button>
                                <button onClick={nextMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Nhãn ngày */}
                        <div className="grid grid-cols-7 gap-2 mb-3">
                            {DAYS.map(d => (
                                <div key={d} className="text-center text-xs font-black text-slate-400 uppercase tracking-widest">{d}</div>
                            ))}
                        </div>

                        {/* Lịch */}
                        <div className="grid grid-cols-7 gap-2">
                            {/* ô trống */}
                            {Array.from({ length: startOffset }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}
                            {/* ô ngày */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const isToday = dateStr === todayStr;
                                const isSelected = dateStr === selectedDay;
                                const hasEvents = !!scheduleDates[dateStr];

                                return (
                                    <div
                                        key={day}
                                        onClick={() => { setSelectedDay(dateStr); }}
                                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-sm font-bold cursor-pointer transition-all relative
                                        ${isSelected ? 'bg-primary-600 text-white shadow-lg shadow-primary-100 dark:shadow-primary-900/30'
                                                : isToday ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                                                    : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}
                                    `}
                                    >
                                        {day}
                                        {hasEvents && (
                                            <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-primary-500'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sidebar: lịch đã chọn */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                {selectedDay && selectedDay !== todayStr
                                    ? `Lịch ngày ${new Date(selectedDay + 'T00:00').toLocaleDateString('vi-VN')}`
                                    : 'Lịch trình hôm nay'}
                            </h2>
                            {selectedDay && selectedDay !== todayStr && (
                                <button onClick={() => setSelectedDay(null)} className="text-slate-400 hover:text-slate-600">
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="animate-spin text-slate-400" size={28} />
                            </div>
                        ) : selectedDaySchedules.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-8 text-center text-slate-400">
                                <p className="font-semibold text-slate-500 dark:text-slate-400">Lịch trống</p>
                                <p className="text-sm mt-1">Bấm nút bên dưới để thêm lịch</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {selectedDaySchedules.map((item) => (
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        key={item.id}
                                        className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group transition-colors"
                                    >
                                        <div
                                            className="absolute top-0 left-0 w-1.5 h-full rounded-l-3xl"
                                            style={{ backgroundColor: getSubjectColor(item.subject_id) }}
                                        />
                                        <div className="space-y-2 pl-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h3>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            {(item.custom_subject || getSubjectName(item.subject_id)) && (
                                                <span
                                                    className="inline-block text-[10px] font-black px-2 py-0.5 rounded-lg text-white font-medium"
                                                    style={{ backgroundColor: getSubjectColor(item.subject_id) }}
                                                >
                                                    {item.custom_subject || getSubjectName(item.subject_id)}
                                                </span>
                                            )}
                                            <div className="flex items-center text-xs text-slate-500 font-medium">
                                                <Clock size={13} className="mr-1.5 text-slate-400" />
                                                {fmtTime(item.start_time)} – {fmtTime(item.end_time)}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => openModal(selectedDay)}
                            className="w-full py-3.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-all border border-primary-100 dark:border-primary-800 shadow-sm"
                        >
                            <Plus size={18} /> Thêm lịch mới
                        </button>


                    </div>
                </div>

                {/* Thêm phương thức lịch trình */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                                onClick={() => setIsModalOpen(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white dark:bg-slate-800 rounded-[32px] w-full max-w-lg p-8 relative z-10 shadow-2xl transition-colors"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Thêm lịch học</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                        <X size={22} />
                                    </button>
                                </div>

                                <form onSubmit={handleSave} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tiêu đề</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.title}
                                            onChange={e => setForm({ ...form, title: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/20"
                                            placeholder="VD: Ôn thi Toán, Hóa học, Tiếng Anh..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Môn học</label>
                                        <input
                                            type="text"
                                            value={form.custom_subject}
                                            onChange={e => setForm({ ...form, custom_subject: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/20"
                                            placeholder="Nhập tên môn học..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Bắt đầu</label>
                                            <input
                                                type="datetime-local"
                                                required
                                                value={form.start_time}
                                                onChange={e => setForm({ ...form, start_time: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Kết thúc</label>
                                            <input
                                                type="datetime-local"
                                                required
                                                value={form.end_time}
                                                onChange={e => setForm({ ...form, end_time: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-2 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center"
                                        >
                                            {saving ? <Loader2 className="animate-spin" size={20} /> : 'Lưu lịch học'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <ConfirmDialog
                isOpen={confirmDialog.open}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog(d => ({ ...d, open: false }))}
                confirmText="Xóa"
            />
        </>
    );
};

export default SchedulePage;
