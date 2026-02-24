import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Calendar,
    CheckCircle2,
    Circle,
    Trash2,
    Edit2,
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        subject_id: null
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/stms/tasks/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data);
        } catch (err) {
            console.error('Error fetching tasks', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/stms/tasks/', newTask, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen(false);
            setNewTask({ title: '', description: '', priority: 'medium', due_date: '', subject_id: null });
            fetchTasks();
        } catch (err) {
            console.error('Error creating task', err);
        }
    };

    const toggleTaskStatus = async (task) => {
        try {
            const token = localStorage.getItem('token');
            const newStatus = task.status === 'completed' ? 'pending' : 'completed';
            await axios.put(`http://localhost:8000/stms/tasks/${task.id}`,
                { ...task, status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTasks();
        } catch (err) {
            console.error('Error updating task', err);
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/stms/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (err) {
            console.error('Error deleting task', err);
        }
    };

    const getPriorityColor = (p) => {
        if (p === 'high') return 'text-red-500 bg-red-50';
        if (p === 'medium') return 'text-amber-500 bg-amber-50';
        return 'text-green-500 bg-green-50';
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Nhiệm vụ của tôi 📝</h1>
                    <p className="text-slate-500">Quản lý và theo dõi tiến độ học tập hàng ngày.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-600 text-white px-6 py-3 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all font-bold"
                >
                    <Plus size={20} />
                    <span>Thêm nhiệm vụ mới</span>
                </button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm nhiệm vụ..."
                        className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 text-sm focus:ring-2 focus:ring-primary-500/20"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all">
                        <Filter size={16} />
                        <span>Lọc</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all">
                        <Calendar size={16} />
                        <span>Ngày</span>
                    </button>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-20 text-slate-400 italic">Đang tải nhiệm vụ...</div>
                ) : tasks.length === 0 ? (
                    <div className="bg-white p-20 rounded-[40px] border border-dashed border-slate-200 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <p className="text-slate-900 font-bold">Chưa có nhiệm vụ nào</p>
                            <p className="text-slate-500 text-sm">Hãy bắt đầu bằng cách thêm một nhiệm vụ mới!</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {tasks.map((task) => (
                            <motion.div
                                layout
                                key={task.id}
                                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:border-primary-200 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => toggleTaskStatus(task)}
                                            className={`transition-colors ${task.status === 'completed' ? 'text-green-500' : 'text-slate-300 hover:text-primary-500'}`}
                                        >
                                            {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                        </button>
                                        <div>
                                            <h3 className={`text-lg font-bold transition-all ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                                {task.title}
                                            </h3>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg ${getPriorityColor(task.priority)}`}>
                                                    {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                                </span>
                                                {task.due_date && (
                                                    <span className="text-[11px] text-slate-400 font-medium">
                                                        Hạn: {new Date(task.due_date).toLocaleDateString('vi-VN')}
                                                    </span>
                                                )}
                                            </div>
                                            {task.description && (
                                                <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all">
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
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
                            className="bg-white rounded-[32px] w-full max-w-lg p-8 relative z-10 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Tạo nhiệm vụ mới</h2>
                            <form onSubmit={handleCreateTask} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Tên nhiệm vụ</label>
                                    <input
                                        type="text"
                                        required
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="VD: Làm bài tập Toán trang 45"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Mô tả</label>
                                    <textarea
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/20 h-24"
                                        placeholder="Chi tiết về nhiệm vụ..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Mức độ ưu tiên</label>
                                        <select
                                            value={newTask.priority}
                                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                            className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/20"
                                        >
                                            <option value="low">Thấp</option>
                                            <option value="medium">Trung bình</option>
                                            <option value="high">Cao</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Hạn chót</label>
                                        <input
                                            type="date"
                                            value={newTask.due_date}
                                            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                                            className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/20"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all"
                                    >
                                        Tạo nhiệm vụ
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TaskPage;
