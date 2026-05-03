import React, { useState, useEffect, useRef } from 'react';
import {
    Plus,
    Search,
    CheckCircle2,
    Circle,
    Trash2,
    Edit2,
    Paperclip,
    FileText,
    FolderOpen,
    FolderPlus,
    X,
    Upload,
    Sparkles,
    Loader2,
    BrainCircuit,
    ChevronDown,
    ChevronRight,
    BookOpen,
    Dumbbell,
    Send,
    MessageSquare,
    Wand2
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import { useToast } from '../../components/UI/Toast';

const API = '';

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAILoading, setIsAILoading] = useState(false);
    const [generatedSubtasks, setGeneratedSubtasks] = useState([]);
    const [breakdownFile, setBreakdownFile] = useState(null);
    const [reviewingTask, setReviewingTask] = useState(null);
    const [studyingTask, setStudyingTask] = useState(null);
    const [studyContent, setStudyContent] = useState('');
    const [isStudyLoading, setIsStudyLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupColor, setNewGroupColor] = useState('#6366f1');
    const [expandedGroups, setExpandedGroups] = useState({});
    const [uploadingTaskId, setUploadingTaskId] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });
    // Practice states
    const [practicingTask, setPracticingTask] = useState(null);
    // Study chat states
    const [studyMessagesMap, setStudyMessagesMap] = useState({});
    const [studyChatInput, setStudyChatInput] = useState('');
    const [isStudyChatLoading, setIsStudyChatLoading] = useState(false);
    const [schedulingTaskId, setSchedulingTaskId] = useState(null);
    const studyChatEndRef = useRef(null);
    // Practice chat states
    const [practiceMessagesMap, setPracticeMessagesMap] = useState({});
    const pendingParentTaskRef = useRef(null);
    const isAILoadingRef = useRef(false);
    const [practiceChatInput, setPracticeChatInput] = useState('');
    const [isPracticeChatLoading, setIsPracticeChatLoading] = useState(false);
    const practiceChatEndRef = useRef(null);
    const toast = useToast();

    // ML Predictions
    const [predictedTime, setPredictedTime] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);

    const [newTask, setNewTask] = useState({
        title: '', description: '', priority: 'medium', due_date: '', subject_id: null, group_id: null
    });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchTasks();
        fetchGroups();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${API}/stms/tasks/`, { headers });
            setTasks(response.data);
        } catch (err) {
            console.error('Error fetching tasks', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await axios.get(`${API}/stms/tasks/groups`, { headers });
            setGroups(response.data);
            const expanded = {};
            response.data.forEach(g => { expanded[g.id] = true; });
            setExpandedGroups(prev => ({ ...expanded, ...prev }));
        } catch (err) {
            console.error('Error fetching groups', err);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...newTask, due_date: newTask.due_date ? new Date(newTask.due_date).toISOString() : null };
            const res = await axios.post(`${API}/stms/tasks/`, payload, { headers });
            const createdTaskId = res.data.id;

            if (breakdownFile) {
                const formData = new FormData();
                formData.append('file', breakdownFile);
                try {
                    await axios.post(`${API}/stms/tasks/${createdTaskId}/upload`, formData, {
                        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
                    });
                } catch (uploadErr) {
                    console.error('Error uploading task file', uploadErr);
                }
            }

            if (isAILoadingRef.current) {
                pendingParentTaskRef.current = {
                    id: createdTaskId,
                    priority: payload.priority || 'medium',
                    due_date: payload.due_date,
                    subject_id: payload.subject_id,
                    group_id: payload.group_id
                };
            }

            if (!isAILoadingRef.current && generatedSubtasks.length > 0) {
                for (const sub of generatedSubtasks) {
                    const subPayload = {
                        title: sub.title,
                        description: '',
                        priority: payload.priority || 'medium',
                        due_date: payload.due_date,
                        subject_id: payload.subject_id,
                        group_id: payload.group_id,
                        parent_task_id: createdTaskId,
                        ai_suggested: true
                    };
                    await axios.post(`${API}/stms/tasks/`, subPayload, { headers });
                }
            }

            setIsModalOpen(false);
            setNewTask({ title: '', description: '', priority: 'medium', due_date: '', subject_id: null, group_id: null });
            setGeneratedSubtasks([]);
            setBreakdownFile(null);
            setPredictedTime(null);
            fetchTasks();
            if (isAILoadingRef.current) {
                toast('Đã tạo nhiệm vụ. Đang phân tích...', 'success');
            } else {
                toast('Tạo nhiệm vụ thành công', 'success');
            }
        } catch (err) {
            console.error('Error creating task', err);
            toast('Lỗi tạo nhiệm vụ', 'error');
        }
    };

    const handlePredictTime = async () => {
        if (!newTask.title.trim()) {
            toast('Vui lòng nhập tên nhiệm vụ', 'error');
            return;
        }
        setIsPredicting(true);
        try {
            const res = await axios.post(`${API}/stms/ml/predict-task-time`, {
                subject_id: newTask.subject_id || 0,
                priority_level: newTask.priority === 'high' ? 3 : newTask.priority === 'medium' ? 2 : 1,
                time_of_day: new Date().getHours() >= 18 ? 2 : new Date().getHours() >= 12 ? 1 : 0,
                user_historical_avg: 45
            }, { headers });
            setPredictedTime(res.data.message);
        } catch (err) {
            console.error("Predict error", err);
            toast('Lỗi', 'error');
        } finally {
            setIsPredicting(false);
        }
    };

    const handleAIBreakdown = async () => {
        if (!newTask.title.trim()) {
            toast('Vui lòng nhập tên nhiệm vụ', 'error');
            return;
        }
        setIsAILoading(true);
        isAILoadingRef.current = true;
        pendingParentTaskRef.current = null;
        try {
            const formData = new FormData();
            formData.append('goal', newTask.title);
            if (breakdownFile) formData.append('file', breakdownFile);

            const res = await axios.post(`${API}/stms/ai/breakdown-task`, formData, {
                headers: { ...headers, 'Content-Type': 'multipart/form-data' }
            });
            const subtasks = res.data.subtasks || [];

            if (pendingParentTaskRef.current) {
                const parent = pendingParentTaskRef.current;
                for (const sub of subtasks) {
                    const subPayload = {
                        title: sub.title,
                        description: '',
                        priority: parent.priority,
                        due_date: parent.due_date,
                        subject_id: parent.subject_id,
                        group_id: parent.group_id,
                        parent_task_id: parent.id,
                        ai_suggested: true
                    };
                    await axios.post(`${API}/stms/tasks/`, subPayload, { headers });
                }
                toast('Phân tích thành công', 'success');
                fetchTasks();
                pendingParentTaskRef.current = null;
            } else {
                setGeneratedSubtasks(subtasks);
            }
        } catch (err) {
            console.error('Error', err);
            toast(err.response?.data?.detail || 'Lỗi phân tích', 'error');
        } finally {
            setIsAILoading(false);
            isAILoadingRef.current = false;
        }
    };

    const handleStudySubtask = async (task) => {
        setStudyingTask(task);
        setStudyChatInput('');
        setIsStudyLoading(true);
        setStudyContent('');
        try {
            const res = await axios.post(`${API}/stms/ai/study-subtask`, { task_id: task.id }, { headers });
            setStudyContent(res.data.explanation);

            const chatRes = await axios.get(`${API}/stms/ai/task-chat-history?task_id=${task.id}&chat_type=study`, { headers });
            const savedMessages = (chatRes.data || []).map(m => ({ role: m.role, text: m.message }));
            setStudyMessagesMap(prev => ({ ...prev, [task.id]: savedMessages }));
        } catch (err) {
            console.error('Study Error', err);
            toast(err.response?.data?.detail || 'Lỗi tải bài giảng', 'error');
            setStudyingTask(null);
        } finally {
            setIsStudyLoading(false);
        }
    };

    const handlePracticeSubtask = async (task) => {
        setPracticingTask(task);
        setPracticeChatInput('');
        try {
            const chatRes = await axios.get(`${API}/stms/ai/task-chat-history?task_id=${task.id}&chat_type=practice`, { headers });
            const savedMessages = (chatRes.data || []).map(m => ({ role: m.role, text: m.message }));
            if (savedMessages.length > 0) {
                setPracticeMessagesMap(prev => ({ ...prev, [task.id]: savedMessages }));
            } else {
                setPracticeMessagesMap(prev => ({
                    ...prev,
                    [task.id]: [{ role: 'ai', text: `Xin chào! Mình là EduFlow AI. Mình sẵn sàng hỗ trợ bạn luyện tập về "${task.title}".` }]
                }));
            }
        } catch (err) {
            console.error('Load practice history error', err);
            setPracticeMessagesMap(prev => ({
                ...prev,
                [task.id]: [{ role: 'ai', text: `Xin chào! Mình là EduFlow AI. Mình sẵn sàng hỗ trợ bạn luyện tập về "${task.title}".` }]
            }));
        }
    };

    const handleAutoSchedule = async (task) => {
        setSchedulingTaskId(task.id);
        try {
            const res = await axios.post(`${API}/stms/ai/auto-schedule`, { task_id: task.id }, { headers });
            const blocksCount = res.data.blocks?.length || 0;
            toast(` Xếp thành công ${blocksCount} khung giờ vào Lịch!`, 'success');
        } catch (err) {
            console.error('Auto Schedule Error', err);
            toast(err.response?.data?.detail || 'Lỗi xếp lịch', 'error');
        } finally {
            setSchedulingTaskId(null);
        }
    };

    const handleStudyChat = async (e) => {
        e?.preventDefault();
        if (!studyChatInput.trim() || !studyingTask || isStudyChatLoading) return;
        const userMsg = studyChatInput.trim();
        const taskId = studyingTask.id;
        setStudyMessagesMap(prev => ({ ...prev, [taskId]: [...(prev[taskId] || []), { role: 'user', text: userMsg }] }));
        setStudyChatInput('');
        setIsStudyChatLoading(true);
        try {
            const res = await axios.post(`${API}/stms/ai/study-chat`, { task_id: taskId, message: userMsg, chat_type: 'study' }, { headers });
            setStudyMessagesMap(prev => ({ ...prev, [taskId]: [...(prev[taskId] || []), { role: 'ai', text: res.data.reply }] }));
        } catch (err) {
            console.error('Study Chat Error', err);
            setStudyMessagesMap(prev => ({ ...prev, [taskId]: [...(prev[taskId] || []), { role: 'ai', text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.' }] }));
        } finally {
            setIsStudyChatLoading(false);
            setTimeout(() => studyChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    };

    const handlePracticeChat = async (e) => {
        e?.preventDefault();
        if (!practiceChatInput.trim() || !practicingTask || isPracticeChatLoading) return;
        const userMsg = practiceChatInput.trim();
        const taskId = practicingTask.id;
        setPracticeMessagesMap(prev => ({ ...prev, [taskId]: [...(prev[taskId] || []), { role: 'user', text: userMsg }] }));
        setPracticeChatInput('');
        setIsPracticeChatLoading(true);
        try {
            const res = await axios.post(`${API}/stms/ai/study-chat`, { task_id: taskId, message: userMsg, chat_type: 'practice' }, { headers });
            setPracticeMessagesMap(prev => ({ ...prev, [taskId]: [...(prev[taskId] || []), { role: 'ai', text: res.data.reply }] }));
        } catch (err) {
            console.error('Practice Chat Error', err);
            setPracticeMessagesMap(prev => ({ ...prev, [taskId]: [...(prev[taskId] || []), { role: 'ai', text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.' }] }));
        } finally {
            setIsPracticeChatLoading(false);
            setTimeout(() => practiceChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    };

    const handleEditTask = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...editTask, due_date: editTask.due_date ? new Date(editTask.due_date).toISOString() : null };
            await axios.put(`${API}/stms/tasks/${editTask.id}`, payload, { headers });
            setEditTask(null);
            fetchTasks();
            if (isAILoadingRef.current) {
                toast('Đã lưu nhiệm vụ', 'success');
            } else {
                toast('Đã lưu thay đổi', 'success');
            }
        } catch (err) {
            console.error('Error editing task', err);
            toast('Lỗi', 'error');
        }
    };

    const toggleTaskStatus = async (task) => {
        if (task.status !== 'completed') {
            setReviewingTask(task);
            return;
        }
        try {
            await axios.put(`${API}/stms/tasks/${task.id}`, { ...task, status: 'pending' }, { headers });
            fetchTasks();
        } catch (err) {
            console.error('Error updating task', err);
        }
    };

    const handleReviewSubmit = async (quality) => {
        if (!reviewingTask) return;
        try {
            await axios.put(`${API}/stms/tasks/${reviewingTask.id}`, { ...reviewingTask, status: 'completed' }, { headers });

            if (quality >= 0) {
                await axios.post(`${API}/stms/tasks/${reviewingTask.id}/review`, { quality }, { headers });
            } else {
                toast('Đã hoàn thành nhiệm vụ', 'success');
            }

            setReviewingTask(null);
            fetchTasks();
        } catch (err) {
            console.error('Error submitting review', err);
            toast('Lỗi', 'error');
        }
    };

    const deleteTask = async (id) => {
        setConfirmDialog({
            open: true,
            title: 'Xóa nhiệm vụ',
            message: 'Bạn có chắc chắn muốn xóa nhiệm vụ này?',
            onConfirm: async () => {
                setConfirmDialog(d => ({ ...d, open: false }));
                try {
                    await axios.delete(`${API}/stms/tasks/${id}`, { headers });
                    fetchTasks();
                    toast('Đã xóa nhiệm vụ', 'success');
                } catch (err) {
                    console.error('Error deleting task', err);
                    toast('Lỗi xóa nhiệm vụ', 'error');
                }
            }
        });
    };

    const handleUploadFile = async (taskId, file) => {
        setUploadingTaskId(taskId);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post(`${API}/stms/tasks/${taskId}/upload`, formData, {
                headers: { ...headers, 'Content-Type': 'multipart/form-data' }
            });
            if (editTask && editTask.id === taskId) {
                setEditTask(prev => ({ ...prev, attachments: JSON.stringify(res.data.files) }));
            }
            fetchTasks();
        } catch (err) {
            console.error('Error uploading file', err);
        } finally {
            setUploadingTaskId(null);
        }
    };

    const handleDeleteAttachment = async (taskId, attPath) => {
        try {
            const atts = JSON.parse(editTask.attachments || '[]');
            const newAtts = atts.filter(a => a.path !== attPath);
            const strAtts = JSON.stringify(newAtts);
            const payload = { ...editTask, attachments: strAtts, due_date: editTask.due_date ? new Date(editTask.due_date).toISOString() : null };
            await axios.put(`${API}/stms/tasks/${taskId}`, payload, { headers });

            setEditTask(prev => ({ ...prev, attachments: strAtts }));
            fetchTasks();
            toast('Đã xóa tệp đính kèm', 'success');
        } catch (err) {
            console.error('Error deleting attachment', err);
            toast('Lỗi xóa tệp', 'error');
        }
    };

    const handleEditAIBreakdown = async (attPath) => {
        if (!editTask.title.trim()) {
            toast('Vui lòng nhập tên nhiệm vụ', 'error');
            return;
        }
        setIsAILoading(true);
        isAILoadingRef.current = true;
        try {
            const formData = new FormData();
            formData.append('goal', editTask.title);
            formData.append('task_id', editTask.id);
            if (attPath) formData.append('attachment_path', attPath);

            const res = await axios.post(`${API}/stms/ai/breakdown-task`, formData, {
                headers: { ...headers, 'Content-Type': 'multipart/form-data' }
            });
            const subtasks = res.data.subtasks || [];
            if (subtasks.length > 0) {
                for (const sub of subtasks) {
                    const subPayload = {
                        title: sub.title,
                        description: '',
                        priority: editTask.priority || 'medium',
                        due_date: editTask.due_date,
                        subject_id: editTask.subject_id,
                        group_id: editTask.group_id,
                        parent_task_id: editTask.id,
                        ai_suggested: true
                    };
                    await axios.post(`${API}/stms/tasks/`, subPayload, { headers });
                }
                toast('Phân tích thành công', 'success');
                fetchTasks();
            } else {
                toast('Nhiệm vụ trống...', 'warning');
            }
        } catch (err) {
            console.error('Chat error', err);
            toast(err.response?.data?.detail || 'Lỗi', 'error');
        } finally {
            setIsAILoading(false);
            isAILoadingRef.current = false;
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!newGroupName.trim()) return;
        try {
            await axios.post(`${API}/stms/tasks/groups`, { name: newGroupName, color: newGroupColor }, { headers });
            setShowGroupModal(false);
            setNewGroupName('');
            fetchGroups();
        } catch (err) {
            console.error('Error creating group', err);
        }
    };

    const deleteGroup = async (groupId) => {
        setConfirmDialog({
            open: true,
            title: 'Xóa nhóm',
            message: 'Bạn có muốn xóa nhóm này?',
            onConfirm: async () => {
                setConfirmDialog(d => ({ ...d, open: false }));
                try {
                    await axios.delete(`${API}/stms/tasks/groups/${groupId}`, { headers });
                    fetchGroups();
                    fetchTasks();
                    toast('Đã xóa nhóm', 'success');
                } catch (err) {
                    console.error('Error deleting group', err);
                    toast('Lỗi xóa nhóm', 'error');
                }
            }
        });
    };

    const toggleGroup = (id) => {
        setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredTasks = tasks.filter(t => {
        const matchSearch = t.title.toLowerCase().includes(searchText.toLowerCase());
        const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
        return matchSearch && matchPriority;
    });

    const parentTasks = filteredTasks.filter(t => !t.parent_task_id);

    const ungroupedTasks = parentTasks.filter(t => !t.group_id);
    const groupedTasks = (groupId) => parentTasks.filter(t => t.group_id === groupId);

    const getPriorityColor = (p) => {
        if (p === 'high') return 'text-red-500 bg-red-50 dark:bg-red-900/30';
        if (p === 'medium') return 'text-amber-500 bg-amber-50 dark:bg-amber-900/30';
        return 'text-green-500 bg-green-50 dark:bg-green-900/30';
    };

    const groupColors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

    const TaskCard = ({ task, hasChildren, isExpanded, onToggleExpand }) => (
        <motion.div layout key={task.id}
            className="bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm group hover:border-primary-200 dark:hover:border-primary-700 transition-all">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {hasChildren && (
                        <button onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
                            className="p-1 -ml-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors shrink-0">
                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                    )}
                    <button onClick={() => toggleTaskStatus(task)}
                        className={`transition-colors shrink-0 ${task.status === 'completed' ? 'text-green-500' : 'text-slate-300 hover:text-primary-500'}`}>
                        {task.status === 'completed' ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>
                    <div className="min-w-0 flex-1">
                        <h3 className={`text-base font-bold transition-all break-words ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                            {task.title}
                        </h3>
                        <div className="flex items-center space-x-3 mt-1.5">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg ${getPriorityColor(task.priority)}`}>
                                {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'TB' : 'Thấp'}
                            </span>
                            {task.due_date && (
                                <span className="text-[11px] text-slate-400 font-medium">
                                    Hạn: {new Date(task.due_date).toLocaleDateString('vi-VN')}
                                </span>
                            )}
                        </div>
                        {task.description && <p className="text-sm text-slate-500 mt-1 truncate">{task.description}</p>}

                        {task.parent_task_id && (
                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    onClick={() => handleStudySubtask(task)}
                                    className="text-[11px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-all flex items-center gap-1.5"
                                >
                                    <BookOpen size={12} /> Học tập
                                </button>
                                <button
                                    onClick={() => handlePracticeSubtask(task)}
                                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all flex items-center gap-1.5"
                                >
                                    <Dumbbell size={12} /> Luyện tập
                                </button>
                            </div>
                        )}

                        {!task.parent_task_id && (
                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    onClick={() => handleAutoSchedule(task)}
                                    disabled={schedulingTaskId === task.id}
                                    className="text-[11px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 px-3 py-1.5 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                                >
                                    {schedulingTaskId === task.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                    Xếp lịch
                                </button>
                            </div>
                        )}

                        {/* Tệp đính kèm */}
                        {task.attachments && (() => {
                            try {
                                const atts = JSON.parse(task.attachments); return atts.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {atts.map((att, idx) => (
                                            <a href={`${API}/${att.path}`} target="_blank" rel="noreferrer" key={idx} onClick={e => e.stopPropagation()}
                                                className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-[10px] px-2 py-1 rounded-lg font-medium cursor-pointer shadow-sm">
                                                <FileText size={10} /> {att.name}
                                            </a>
                                        ))}
                                    </div>
                                ) : null;
                            } catch { return null; }
                        })()}
                    </div>
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                    <label className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all cursor-pointer" title="Upload tài liệu">
                        {uploadingTaskId === task.id ? <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /> : <Upload size={15} />}
                        <input type="file" className="hidden" onChange={(e) => { if (e.target.files[0]) handleUploadFile(task.id, e.target.files[0]); }} />
                    </label>
                    <button onClick={() => setEditTask({ ...task, due_date: task.due_date ? task.due_date.split('T')[0] : '' })}
                        className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-xl transition-all">
                        <Edit2 size={15} />
                    </button>
                    <button onClick={() => deleteTask(task.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all">
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>
        </motion.div>
    );

    const TaskWithChildren = ({ task }) => {
        const children = tasks.filter(t => t.parent_task_id === task.id);
        const [isExpanded, setIsExpanded] = useState(false);
        return (
            <div className="space-y-2 w-full">
                <TaskCard
                    task={task}
                    hasChildren={children.length > 0}
                    isExpanded={isExpanded}
                    onToggleExpand={() => setIsExpanded(!isExpanded)}
                />
                <AnimatePresence>
                    {children.length > 0 && isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="ml-8 pl-4 border-l-2 border-indigo-100 dark:border-indigo-800 flex flex-col gap-2 py-1">
                                {children.map(child => <TaskWithChildren key={child.id} task={child} />)}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Nhiệm vụ của tôi</h1>

                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowGroupModal(true)}
                        className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl flex items-center space-x-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all font-bold text-sm">
                        <FolderPlus size={18} /> <span>Tạo nhóm</span>
                    </button>
                    <button onClick={() => setIsModalOpen(true)}
                        className="bg-primary-600 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all font-bold text-sm">
                        <Plus size={18} /> <span>Thêm nhiệm vụ</span>
                    </button>
                </div>
            </div>

            {/*Bộ lọc */}
            <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-800 p-3 rounded-[20px] border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Tìm kiếm nhiệm vụ..." value={searchText} onChange={(e) => setSearchText(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl py-2 pl-9 text-sm focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div className="flex gap-1.5">
                    {['all', 'high', 'medium', 'low'].map(p => (
                        <button key={p} onClick={() => setFilterPriority(p)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterPriority === p ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                                }`}>
                            {p === 'all' ? 'Tất cả' : p === 'high' ? 'Cao' : p === 'medium' ? 'TB' : 'Thấp'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-16 text-slate-400 italic">Đang tải...</div>
            ) : (
                <div className="space-y-5">
                    {/* Nhóm */}
                    {groups.map(group => (
                        <div key={group.id} className="bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                            <div className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                onClick={() => toggleGroup(group.id)}>
                                <div className="flex items-center gap-3">
                                    {expandedGroups[group.id] ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }}></div>
                                    <FolderOpen size={18} style={{ color: group.color }} />
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{group.name}</span>
                                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-semibold">
                                        {groupedTasks(group.id).length}
                                    </span>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); deleteGroup(group.id); }}
                                    className="p-1.5 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <AnimatePresence>
                                {expandedGroups[group.id] && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                        <div className="px-4 pb-4 space-y-2">
                                            {groupedTasks(group.id).length > 0 ? groupedTasks(group.id).map(task => (
                                                <TaskWithChildren key={task.id} task={task} />
                                            )) : (
                                                <div className="text-center py-6 text-slate-300 text-xs italic">Chưa có nhiệm vụ trong nhóm này</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    {/* Nhiệm vụ không được phân nhóm */}
                    {ungroupedTasks.length > 0 && (
                        <div>
                            {groups.length > 0 && (
                                <div className="flex items-center gap-2 mb-3 px-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chưa phân nhóm</span>
                                </div>
                            )}
                            <div className="space-y-3">
                                {ungroupedTasks.map(task => <TaskWithChildren key={task.id} task={task} />)}
                            </div>
                        </div>
                    )}

                    {filteredTasks.length === 0 && (
                        <div className="bg-white dark:bg-slate-800 p-16 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3 transition-colors">
                            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto text-slate-300 dark:text-slate-500">
                                <CheckCircle2 size={28} />
                            </div>
                            <p className="text-slate-900 dark:text-white font-bold">Chưa có nhiệm vụ</p>
                            <p className="text-slate-500 text-sm">Hãy thêm nhiệm vụ mới!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Tạo nhiệm vụ */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-800 rounded-[28px] w-full max-w-lg p-7 relative z-10 shadow-2xl transition-colors">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Tạo nhiệm vụ mới</h2>
                            <form onSubmit={handleCreateTask} className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-xs font-bold text-slate-700">Tên nhiệm vụ</label>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={handlePredictTime}
                                                disabled={isPredicting}
                                                className="text-[11px] bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2.5 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                                                {isPredicting ? 'Đang tính...' : 'Phân tích thời gian'}
                                            </button>
                                            <button type="button" onClick={handleAIBreakdown}
                                                disabled={isAILoading}
                                                className="text-[11px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2.5 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-28">
                                                {isAILoading ? 'Đang xử lý...' : 'Chia nhiệm vụ'}
                                            </button>
                                        </div>
                                    </div>
                                    <input type="text" required value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="VD: Viết tóm tắt bài văn, đoạn văn,..." />

                                    <div className="flex items-center gap-2 mt-2">
                                        <label className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors flex items-center gap-1.5 flex-1 justify-center border border-dashed border-slate-300">
                                            <Paperclip size={12} /> {breakdownFile ? <span className="text-slate-700 truncate">{breakdownFile.name}</span> : 'Đính kèm tài liệu (Tùy chọn)'}
                                            <input type="file" accept=".pdf,.docx,.txt,.xlsx" className="hidden" onChange={e => setBreakdownFile(e.target.files[0])} />
                                        </label>
                                        {breakdownFile && (
                                            <button type="button" onClick={() => setBreakdownFile(null)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {predictedTime && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 text-emerald-700 text-xs font-bold p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                                        <Sparkles size={16} className="text-emerald-500 shrink-0" />
                                        <span>{predictedTime}</span>
                                    </motion.div>
                                )}

                                {generatedSubtasks.length > 0 && (
                                    <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-3 rounded-[16px] border border-indigo-100 dark:border-indigo-800/50">
                                        <h4 className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 mb-2 tracking-wide">Danh sách nhiệm vụ đề xuất:</h4>
                                        <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                            {generatedSubtasks.map((st, i) => (
                                                <li key={i} className="text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between bg-white dark:bg-slate-700 px-2.5 py-2 rounded-xl border border-indigo-50 dark:border-slate-600 shadow-sm">
                                                    <span className="font-medium truncate mr-2 flex-1">- {st.title}</span>
                                                    <span className="font-black text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md whitespace-nowrap">{st.estimated_pomodoros} Pomodoro</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mô tả</label>
                                    <textarea value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary-500/20 h-20"
                                        placeholder="Chi tiết về nhiệm vụ..." />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ưu tiên</label>
                                        <select value={newTask.priority}
                                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-500/20">
                                            <option value="low">Thấp</option>
                                            <option value="medium">Trung bình</option>
                                            <option value="high">Cao</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hạn chót</label>
                                        <input type="date" value={newTask.due_date}
                                            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nhóm</label>
                                        <select value={newTask.group_id || ''}
                                            onChange={(e) => setNewTask({ ...newTask, group_id: e.target.value ? parseInt(e.target.value) : null })}
                                            className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-500/20">
                                            <option value="">Nhóm trống</option>
                                            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-3 flex gap-3">
                                    <button type="button" onClick={() => { setIsModalOpen(false); setGeneratedSubtasks([]); setBreakdownFile(null); setPredictedTime(null); }}
                                        className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-sm">Hủy</button>
                                    <button type="submit"
                                        className="flex-1 py-2.5 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all text-sm">
                                        {generatedSubtasks.length > 0 ? 'Tạo tất cả Sub-tasks' : 'Tạo nhiệm vụ'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Chỉnh sửa nhiệm vụ */}
            <AnimatePresence>
                {editTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setEditTask(null); setGeneratedSubtasks([]); }} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-800 rounded-[28px] w-full max-w-lg p-7 relative z-10 shadow-2xl">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Chỉnh sửa nhiệm vụ</h2>
                            <form onSubmit={handleEditTask} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tên nhiệm vụ</label>
                                    <input type="text" required value={editTask.title}
                                        onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                                        className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary-500/20" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mô tả</label>
                                    <textarea value={editTask.description || ''}
                                        onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                                        className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary-500/20 h-20" />
                                </div>

                                {/* Phần đính kèm tài liệu */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">Tài liệu đính kèm</label>
                                    {editTask.attachments && (() => {
                                        try {
                                            const atts = JSON.parse(editTask.attachments); return atts.length > 0 ? (
                                                <div className="flex flex-col gap-2 mb-3">
                                                    {atts.map((att, idx) => (
                                                        <div key={idx} className="flex items-center justify-between bg-blue-50/50 border border-blue-100 px-3 py-2 rounded-xl group/att relative">
                                                            <a href={`${API}/${att.path}`} target="_blank" rel="noreferrer"
                                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-[11px] font-bold truncate flex-1 cursor-pointer transition-colors pr-24" title="Xem tài liệu">
                                                                <FileText size={14} className="shrink-0" /> <span className="truncate">{att.name}</span>
                                                            </a>

                                                            <div className="absolute right-3 flex items-center gap-1 opacity-0 group-hover/att:opacity-100 transition-all">
                                                                <button type="button" onClick={() => handleEditAIBreakdown(att.path)}
                                                                    disabled={isAILoading} title="Phân tích tác vụ này"
                                                                    className="px-2.5 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-bold text-[10px] flex items-center gap-1.5 hover:shadow-md disabled:opacity-50">
                                                                    <Wand2 size={12} /> {isAILoading ? '...' : 'Phân Tích'}
                                                                </button>
                                                                <button type="button" onClick={() => handleDeleteAttachment(editTask.id, att.path)}
                                                                    className="p-1.5 bg-red-100 text-red-500 hover:text-red-700 hover:bg-red-200 rounded-lg transition-colors shrink-0">
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : null;
                                        } catch { return null; }
                                    })()}
                                    <label className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors text-sm text-slate-500">
                                        <Upload size={16} /> Chọn file để upload
                                        <input type="file" className="hidden" onChange={(e) => {
                                            if (e.target.files[0]) handleUploadFile(editTask.id, e.target.files[0]);
                                        }} />
                                    </label>
                                </div>

                                {generatedSubtasks.length > 0 && (
                                    <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-3 rounded-[16px] border border-indigo-100 dark:border-indigo-800/50 mt-2">
                                        <h4 className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 mb-2 tracking-wide">Danh sách nhiệm vụ đề xuất:</h4>
                                        <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                            {generatedSubtasks.map((st, i) => (
                                                <li key={i} className="text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between bg-white dark:bg-slate-700 px-2.5 py-2 rounded-xl border border-indigo-50 dark:border-slate-600 shadow-sm">
                                                    <span className="font-medium truncate mr-2 flex-1">- {st.title}</span>
                                                    <span className="font-black text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md whitespace-nowrap">{st.estimated_pomodoros} Pomodoro</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ưu tiên</label>
                                        <select value={editTask.priority}
                                            onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
                                            className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-500/20">
                                            <option value="low">Thấp</option>
                                            <option value="medium">Trung bình</option>
                                            <option value="high">Cao</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hạn chót</label>
                                        <input type="date" value={editTask.due_date || ''}
                                            onChange={(e) => setEditTask({ ...editTask, due_date: e.target.value })}
                                            className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nhóm</label>
                                        <select value={editTask.group_id || ''}
                                            onChange={(e) => setEditTask({ ...editTask, group_id: e.target.value ? parseInt(e.target.value) : null })}
                                            className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-500/20">
                                            <option value="">Nhóm trống...</option>
                                            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-3 flex gap-3">
                                    <button type="button" onClick={() => { setEditTask(null); setGeneratedSubtasks([]); }}
                                        className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-sm">Hủy</button>
                                    <button type="submit"
                                        className="flex-1 py-2.5 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all text-sm">Lưu thay đổi</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Tạo nhóm */}
            <AnimatePresence>
                {showGroupModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowGroupModal(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-800 rounded-[28px] w-full max-w-sm p-7 relative z-10 shadow-2xl">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5"> Tạo nhóm mới</h2>
                            <form onSubmit={handleCreateGroup} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tên nhóm</label>
                                    <input type="text" required value={newGroupName}
                                        onChange={(e) => setNewGroupName(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="VD: Toán, Lý, Hóa..." />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Màu sắc</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {groupColors.map(c => (
                                            <button key={c} type="button" onClick={() => setNewGroupColor(c)}
                                                className={`w-8 h-8 rounded-full transition-all ${newGroupColor === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110'}`}
                                                style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-3 flex gap-3">
                                    <button type="button" onClick={() => setShowGroupModal(false)}
                                        className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-sm">Hủy</button>
                                    <button type="submit"
                                        className="flex-1 py-2.5 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all text-sm">Tạo nhóm</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmDialog
                isOpen={confirmDialog.open}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog(d => ({ ...d, open: false }))}
                confirmText="Xóa"
            />

            {/* SM-2 Review Modal */}
            <AnimatePresence>
                {reviewingTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setReviewingTask(null)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-800 dark:text-white rounded-[28px] w-full max-w-sm overflow-hidden relative z-10 shadow-2xl">

                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                                    <BrainCircuit size={32} className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold mb-1">Đánh giá độ hiểu bài</h2>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="text-center font-semibold text-slate-800 dark:text-slate-200 mb-2 truncate px-4">
                                    "{reviewingTask.title}"
                                </div>

                                <div className="grid grid-cols-1 gap-2.5">
                                    <button onClick={() => handleReviewSubmit(4)} className="flex items-center justify-center p-3.5 rounded-xl border-2 border-green-100 dark:border-green-800 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all group">
                                        <span className="font-bold text-green-700 dark:text-green-400">Bình thường</span>
                                    </button>
                                    <button onClick={() => handleReviewSubmit(1)} className="flex items-center justify-center p-3.5 rounded-xl border-2 border-red-100 dark:border-red-800 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all group">
                                        <span className="font-bold text-red-700 dark:text-red-400">Khó</span>
                                    </button>
                                </div>

                                <button onClick={() => handleReviewSubmit(-1)} className="w-full mt-2 py-3 text-slate-400 font-bold hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all">
                                    Bỏ qua
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal học tập AI*/}
            <AnimatePresence>
                {studyingTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setStudyingTask(null)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-800 dark:text-white rounded-[32px] w-full max-w-3xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col">

                            {/* Header */}
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Bài giảng</h2>
                                        <p className="text-xs text-slate-500 truncate max-w-[400px]">{studyingTask.title}</p>
                                    </div>
                                </div>
                                <button onClick={() => setStudyingTask(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Nội dung + Chat*/}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
                                {/* Nội dung bài giảng*/}
                                {isStudyLoading && (!studyMessagesMap[studyingTask.id]) ? (
                                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                        <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                                        <p className="text-slate-400 font-medium animate-pulse">EduFlow AI đang soạn thảo bài giảng...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="prose prose-slate dark:prose-invert prose-sm max-w-none bg-slate-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{studyContent}</ReactMarkdown>
                                        </div>

                                        {/* Tin nhắn */}
                                        {(studyMessagesMap[studyingTask.id] || []).length > 0 && (
                                            <div className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-3">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    <MessageSquare size={12} /> Hỏi đáp
                                                </div>
                                                {(studyMessagesMap[studyingTask.id] || []).map((msg, idx) => (
                                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${msg.role === 'user'
                                                            ? 'bg-primary-600 text-white rounded-br-md'
                                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-md'
                                                            }`}>
                                                            {msg.role === 'ai' ? (
                                                                <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                                                </div>
                                                            ) : msg.text}
                                                        </div>
                                                    </div>
                                                ))}
                                                {isStudyChatLoading && (
                                                    <div className="flex justify-start">
                                                        <div className="bg-slate-100 dark:bg-slate-700 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-md text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div ref={studyChatEndRef} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Input Chat*/}
                            {(!isStudyLoading || studyContent) && (
                                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
                                    <form onSubmit={handleStudyChat} className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={studyChatInput}
                                            onChange={(e) => setStudyChatInput(e.target.value)}
                                            placeholder="Nhập thêm yêu cầu..."
                                            className="flex-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 outline-none transition-all"
                                            disabled={isStudyChatLoading}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!studyChatInput.trim() || isStudyChatLoading}
                                            className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal luyện tập AI*/}
            <AnimatePresence>
                {practicingTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setPracticingTask(null)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-800 dark:text-white rounded-[32px] w-full max-w-3xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col">

                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-900/10 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                                        <Dumbbell size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Luyện tập</h2>
                                        <p className="text-xs text-slate-500 truncate max-w-[400px]">{practicingTask.title}</p>
                                    </div>
                                </div>
                                <button onClick={() => setPracticingTask(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Tin nhắn */}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-3">
                                {(practiceMessagesMap[practicingTask.id] || []).map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'ai' && (
                                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0 mr-2 mt-1">
                                                <Dumbbell size={14} />
                                            </div>
                                        )}
                                        <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${msg.role === 'user'
                                            ? 'bg-emerald-600 text-white rounded-br-md'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-md'
                                            }`}>
                                            {msg.role === 'ai' ? (
                                                <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                                </div>
                                            ) : msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isPracticeChatLoading && (
                                    <div className="flex justify-start">
                                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0 mr-2 mt-1">
                                            <Dumbbell size={14} />
                                        </div>
                                        <div className="bg-slate-100 dark:bg-slate-700 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-md text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={practiceChatEndRef} />
                            </div>

                            {/* Input Chat*/}
                            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-emerald-50/30 dark:bg-emerald-900/10 shrink-0">
                                <form onSubmit={handlePracticeChat} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={practiceChatInput}
                                        onChange={(e) => setPracticeChatInput(e.target.value)}
                                        placeholder="Nhập câu hỏi..."
                                        className="flex-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 outline-none transition-all"
                                        disabled={isPracticeChatLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!practiceChatInput.trim() || isPracticeChatLoading}
                                        className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TaskPage;
