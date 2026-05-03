import React, { useState, useEffect } from 'react';
import { Book, Star, Plus, Trash2, Edit2, X, Loader2, ChevronRight, Target, Upload, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import { useToast } from '../../components/UI/Toast';

const API = '';

const PALETTE = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
    '#ef4444', '#ec4899', '#06b6d4', '#f97316',
];

//Sparkle SVG
const Sparkle = ({ className, size }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.9L12 17l-6.2 5 2.4-7.9L2 9.6h7.6L12 2z" />
    </svg>
);

// Subject Card
const SubjectCard = ({ subject, taskCount, onEdit, onDelete, onUpload, onDeleteFile, files, uploadingId, onAutoSchedule, schedulingSubjectId }) => {
    const color = subject.color_code || '#3b82f6';
    const token = localStorage.getItem('token');

    const handleDownload = async (fileName) => {
        try {
            const res = await fetch(`${API}/stms/subjects/${subject.id}/files/${encodeURIComponent(fileName)}/download`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Download failed');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden"
        >
            <div
                className="absolute top-0 right-0 w-32 h-32 opacity-5 -mr-16 -mt-16 rounded-full transition-transform group-hover:scale-150 duration-700"
                style={{ backgroundColor: color }}
            />

            <div
                className="w-14 h-14 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                style={{ backgroundColor: color }}
            >
                <Book size={28} />
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{subject.subject_name}</h3>
            {subject.description && (
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{subject.description}</p>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 mb-4 text-center">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{subject.target_hours_per_week}h</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mục tiêu/tuần</p>
            </div>
            {files && files.length > 0 && (
                <div className="mb-4 space-y-1">
                    {files.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] px-2.5 py-1 rounded-lg font-medium group/file">
                            <FileText size={10} />
                            <span className="truncate cursor-pointer hover:underline" onClick={() => handleDownload(f.name)}>{f.name}</span>
                            <span className="text-blue-400 ml-auto shrink-0">{f.size_kb}KB</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteFile(subject.id, f.name); }}
                                className="ml-1 text-blue-300 hover:text-red-500 opacity-0 group-hover/file:opacity-100 transition-opacity shrink-0"
                                title="Xóa file"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    ))}
                    {files.length > 3 && (
                        <p className="text-[10px] text-slate-400 text-center">+{files.length - 3} file khác</p>
                    )}
                </div>
            )}

            <div className="flex justify-center items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-700 mt-4">
                <label
                    title="Upload tài liệu"
                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all cursor-pointer"
                >
                    {uploadingId === subject.id ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                    <input type="file" className="hidden" onChange={(e) => { if (e.target.files[0]) onUpload(subject.id, e.target.files[0]); }} />
                </label>
                <button
                    title="Xếp lịch"
                    onClick={() => onAutoSchedule(subject.id)}
                    disabled={schedulingSubjectId === subject.id}
                    className="p-2 text-slate-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-xl transition-all disabled:opacity-50"
                >
                    {schedulingSubjectId === subject.id ? <Loader2 size={18} className="animate-spin" /> : <Star size={18} />}
                </button>
                <button
                    title="Sửa môn học"
                    onClick={() => onEdit(subject)}
                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    title="Xóa môn học"
                    onClick={() => onDelete(subject.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </motion.div>
    );
};

// MAIN
const SubjectsPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [saving, setSaving] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });
    const [subjectFiles, setSubjectFiles] = useState({});
    const [uploadingId, setUploadingId] = useState(null);
    const [schedulingSubjectId, setSchedulingSubjectId] = useState(null);
    const toast = useToast();
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const emptyForm = {
        subject_name: '',
        subject_code: '',
        description: '',
        color_code: '#3b82f6',
        target_hours_per_week: 5,
        priority: 'medium',
    };
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        fetchAll();
    }, []);

    useEffect(() => {
        if (subjects.length > 0) {
            subjects.forEach(s => loadFiles(s.id));
        }
    }, [subjects]);

    const loadFiles = async (subjectId) => {
        try {
            const res = await axios.get(`${API}/stms/subjects/${subjectId}/files`, { headers });
            setSubjectFiles(prev => ({ ...prev, [subjectId]: res.data }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleUploadSubjectFile = async (subjectId, file) => {
        setUploadingId(subjectId);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('doc_type', 'lecture');
            await axios.post(`${API}/stms/subjects/${subjectId}/upload`, formData, {
                headers: { ...headers, 'Content-Type': 'multipart/form-data' }
            });
            toast(`Đã upload ${file.name}`, 'success');
            loadFiles(subjectId);
        } catch (err) {
            toast('Upload thất bại', 'error');
        } finally {
            setUploadingId(null);
        }
    };

    const handleDeleteSubjectFile = async (subjectId, fileName) => {
        try {
            await axios.delete(`${API}/stms/subjects/${subjectId}/files/${encodeURIComponent(fileName)}`, { headers });
            toast(`Đã xóa ${fileName}`, 'success');
            loadFiles(subjectId);
        } catch (err) {
            toast('Lỗi xóa file', 'error');
        }
    };

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [subRes, taskRes] = await Promise.allSettled([
                axios.get(`${API}/stms/subjects/`, { headers }),
                axios.get(`${API}/stms/tasks/`, { headers }),
            ]);
            if (subRes.status === 'fulfilled') setSubjects(subRes.value.data);
            if (taskRes.status === 'fulfilled') setTasks(taskRes.value.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const taskCountForSubject = (subjectId) =>
        tasks.filter(t => t.subject_id === subjectId).length;

    const openCreate = () => {
        setEditingSubject(null);
        setForm(emptyForm);
        setIsModalOpen(true);
    };

    const openEdit = (subject) => {
        setEditingSubject(subject);
        setForm({
            subject_name: subject.subject_name,
            subject_code: subject.subject_code || '',
            description: subject.description || '',
            color_code: subject.color_code || '#3b82f6',
            target_hours_per_week: subject.target_hours_per_week || 5,
            priority: subject.priority || 'medium',
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingSubject) {
                await axios.put(`${API}/stms/subjects/${editingSubject.id}`, { ...form, is_active: true }, { headers });
            } else {
                await axios.post(`${API}/stms/subjects/`, form, { headers });
            }
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
            title: 'Xóa môn học',
            message: 'Xóa môn học này? Các lịch học liên quan cũng sẽ bị ảnh hưởng.',
            onConfirm: async () => {
                setConfirmDialog(d => ({ ...d, open: false }));
                try {
                    await axios.delete(`${API}/stms/subjects/${id}`, { headers });
                    fetchAll();
                    toast('Đã xóa môn học', 'success');
                } catch (err) {
                    toast(err.response?.data?.detail || 'Lỗi xóa môn học', 'error');
                }
            }
        });
    };

    const handleAutoSchedule = async (subjectId) => {
        setSchedulingSubjectId(subjectId);
        try {
            const res = await axios.post(`${API}/stms/ai/auto-schedule`, { subject_id: subjectId }, { headers });
            const blocksCount = res.data.blocks?.length || 0;
            toast(`✨ Đã xếp thành công ${blocksCount} khung giờ cho Môn học này!`, 'success');
        } catch (err) {
            console.error('Auto Schedule Error', err);
            toast(err.response?.data?.detail || 'Lỗi xếp lịch', 'error');
        } finally {
            setSchedulingSubjectId(null);
        }
    };

    return (
        <>
            <div className="space-y-12">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Môn học của tôi</h1>

                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-primary-600 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all font-bold"
                    >
                        <Plus size={20} />
                        <span>Thêm môn học</span>
                    </button>
                </div>

                {/* Môn học */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 p-8 animate-pulse">
                                <div className="w-14 h-14 bg-slate-200 rounded-2xl mb-6" />
                                <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-slate-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : subjects.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-700 p-20 text-center">
                        <Book size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="font-bold text-slate-700 dark:text-slate-300">Chưa có môn học nào</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Thêm môn học để bắt đầu lên lịch và quản lý nhiệm vụ!</p>
                        <button
                            onClick={openCreate}
                            className="mt-6 bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold inline-flex items-center gap-2 hover:bg-primary-700 transition-all"
                        >
                            <Plus size={18} /> Thêm môn học
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        {subjects.map(s => (
                            <SubjectCard
                                key={s.id}
                                subject={s}
                                taskCount={taskCountForSubject(s.id)}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                                onUpload={handleUploadSubjectFile}
                                onDeleteFile={handleDeleteSubjectFile}
                                files={subjectFiles[s.id] || []}
                                uploadingId={uploadingId}
                                onAutoSchedule={handleAutoSchedule}
                                schedulingSubjectId={schedulingSubjectId}
                            />
                        ))}
                    </div>
                )}


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
                                className="bg-white dark:bg-slate-800 rounded-[32px] w-full max-w-lg p-8 relative z-10 shadow-2xl"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {editingSubject ? 'Sửa môn học' : '➕ Thêm môn học'}
                                    </h2>
                                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                        <X size={22} />
                                    </button>
                                </div>

                                <form onSubmit={handleSave} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tên môn học *</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.subject_name}
                                            onChange={e => setForm({ ...form, subject_name: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/20"
                                            placeholder="VD: Toán học, Tiếng Anh..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Mô tả (tuỳ chọn)</label>
                                        <textarea
                                            value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/20 h-20"
                                            placeholder="Ghi chú về môn học..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Mục tiêu (giờ/tuần)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="40"
                                                value={form.target_hours_per_week}
                                                onChange={e => setForm({ ...form, target_hours_per_week: parseInt(e.target.value) })}
                                                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Độ ưu tiên</label>
                                            <select
                                                value={form.priority}
                                                onChange={e => setForm({ ...form, priority: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/20"
                                            >
                                                <option value="low">Thấp</option>
                                                <option value="medium">Trung bình</option>
                                                <option value="high">Cao</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Màu sắc</label>
                                        <div className="flex gap-3 flex-wrap">
                                            {PALETTE.map(c => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, color_code: c })}
                                                    className={`w-9 h-9 rounded-xl transition-all ${form.color_code === c ? 'ring-4 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'}`}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
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
                                            className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-2xl shadow-lg hover:bg-primary-700 transition-all flex items-center justify-center"
                                        >
                                            {saving ? <Loader2 className="animate-spin" size={20} /> : (editingSubject ? 'Lưu thay đổi' : 'Thêm môn học')}
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

export default SubjectsPage;
