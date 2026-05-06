import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Paperclip, Loader2, FileText, X, Trash2, Plus, MessageSquare, Upload, Menu, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = '';

const AIPage = () => {
    const [threads, setThreads] = useState([]);
    const [activeThread, setActiveThread] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const messagesEndRef = useRef(null);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        loadThreads();
    }, []);
    useEffect(() => {
        if (activeThread) {
            loadMessages(activeThread);
        }
    }, [activeThread]);

    const loadThreads = async () => {
        try {
            const res = await axios.get(`${API}/stms/ai/threads`, { headers });
            setThreads(res.data);
            if (res.data.length > 0 && !activeThread) {
                setActiveThread(res.data[0].thread_id);
            } else if (res.data.length === 0) {
                setMessages([{ role: 'ai', text: 'Chào bạn! Mình là EduFlow AI. Bắt đầu cuộc trò chuyện mới bằng cách gõ tin nhắn bên dưới nhé!' }]);
                setHistoryLoaded(true);
            }
        } catch {
            setHistoryLoaded(true);
        }
    };

    const loadMessages = async (threadId) => {
        setHistoryLoaded(false);
        try {
            const res = await axios.get(`${API}/stms/ai/history?thread_id=${threadId}`, { headers });
            if (res.data.length > 0) {
                setMessages(res.data.map(m => ({ id: m.id, role: m.role, text: m.message, file: m.file_name })));
            } else {
                setMessages([{ role: 'ai', text: 'Cuộc trò chuyện mới. Hỏi mình bất cứ điều gì!' }]);
            }
        } catch {
            setMessages([{ role: 'ai', text: 'Không thể tải lịch sử.' }]);
        } finally {
            setHistoryLoaded(true);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => { scrollToBottom(); }, [messages, loading]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
    };

    const createNewThread = () => {
        const newId = `thread_${Date.now()}`;
        setActiveThread(newId);
        setMessages([{ role: 'ai', text: 'Cuộc trò chuyện mới! Mình có thể giúp gì cho bạn?' }]);
        setHistoryLoaded(true);
    };

    const deleteThread = async (threadId, e) => {
        e.stopPropagation();
        try {
            await axios.delete(`${API}/stms/ai/threads/${threadId}`, { headers });
            const remaining = threads.filter(t => t.thread_id !== threadId);
            setThreads(remaining);
            if (activeThread === threadId) {
                if (remaining.length > 0) {
                    setActiveThread(remaining[0].thread_id);
                } else {
                    setActiveThread(null);
                    setMessages([{ role: 'ai', text: 'Chào bạn! Tạo cuộc trò chuyện mới nhé!' }]);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() && !selectedFile) return;

        let currentThread = activeThread || `thread_${Date.now()}`;
        if (!activeThread) setActiveThread(currentThread);

        const newMsg = { role: 'user', text: input, file: selectedFile ? selectedFile.name : null };
        setMessages(prev => [...prev, newMsg]);
        const currentInput = input;
        const currentFile = selectedFile;
        setInput('');
        setSelectedFile(null);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('message', currentInput || 'Hãy tóm tắt hoặc giải thích tài liệu này.');
            formData.append('thread_id', currentThread);
            if (currentFile) formData.append('file', currentFile);

            const res = await axios.post(`${API}/stms/ai/chat`, formData, {
                headers: { ...headers, 'Content-Type': 'multipart/form-data' }
            });

            setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
            loadThreads();
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', text: 'Xin lỗi, EduFlow AI đang gặp sự cố. Vui lòng thử lại sau.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleDocUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        let currentThread = activeThread || `thread_${Date.now()}`;
        if (!activeThread) setActiveThread(currentThread);

        setMessages(prev => [...prev, { role: 'user', text: `📄 Upload tài liệu: ${file.name}`, file: file.name }]);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('question', 'Hãy tóm tắt nội dung tài liệu này cho tôi.');
            formData.append('thread_id', currentThread);

            const res = await axios.post(`${API}/stms/ai/upload-doc`, formData, {
                headers: { ...headers, 'Content-Type': 'multipart/form-data' }
            });
            setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
            loadThreads();
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', text: 'Không thể phân tích tài liệu. Thử lại sau.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex rounded-[32px] max-md:rounded-none overflow-hidden border border-slate-100 dark:border-slate-700 max-md:border-0 shadow-sm bg-white dark:bg-slate-900 transition-colors relative">
            {/* Mobile overlay */}
            {showSidebar && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden" onClick={() => setShowSidebar(false)} />}
            {/* Thanh bên - Danh sách cuộc trò chuyện */}
            <div className={`w-72 bg-slate-50 dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 flex flex-col shrink-0 transition-all max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-40 max-md:w-[280px] max-md:shadow-2xl ${showSidebar ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}`}>
                <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                    <button
                        onClick={() => { createNewThread(); setShowSidebar(false); }}
                        className="w-full bg-primary-600 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md shadow-primary-200 hover:bg-primary-700 transition-all text-sm"
                    >
                        <Plus size={18} /> Trò chuyện mới
                    </button>
                </div>


                <div className="px-4 pt-3 pb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lịch sử trò chuyện</span>
                </div>

                <div className="flex-1 overflow-y-auto px-2 space-y-1">
                    {threads.map(t => (
                        <div
                            key={t.thread_id}
                            onClick={() => { setActiveThread(t.thread_id); setShowSidebar(false); }}
                            className={`p-3 rounded-xl cursor-pointer flex items-start justify-between group transition-all ${activeThread === t.thread_id
                                ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800'
                                : 'hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700'
                                }`}
                        >
                            <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                <MessageSquare size={14} className={`mt-0.5 shrink-0 ${activeThread === t.thread_id ? 'text-primary-500' : 'text-slate-400'}`} />
                                <div className="min-w-0 flex-1">
                                    <p className={`text-xs font-semibold truncate ${activeThread === t.thread_id ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {t.title}
                                    </p>
                                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{t.last_message}</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => deleteThread(t.thread_id, e)}
                                className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                    {threads.length === 0 && (
                        <div className="text-center py-8 text-slate-400 text-xs">
                            Trống
                        </div>
                    )}
                </div>
            </div>

            {/*khu vực chat */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="bg-slate-900 px-6 max-md:px-4 py-4 text-white flex items-center gap-4 max-md:gap-3 shrink-0">
                    <button onClick={() => setShowSidebar(true)} className="md:hidden p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors">
                        <Menu size={20} />
                    </button>
                    <div className="w-10 h-10 max-md:w-8 max-md:h-8 bg-white/10 rounded-xl flex items-center justify-center">
                        <Bot className="text-amber-400" size={20} />
                    </div>
                    <div>
                        <h2 className="text-base max-md:text-sm font-bold">EduFlow AI Assistant</h2>
                        <p className="text-slate-400 text-[11px] max-md:hidden">Hỏi đáp · Tóm tắt tài liệu · Phân tích</p>
                    </div>
                </div>

                {/*khu vực chat */}
                <div className="flex-1 overflow-y-auto p-6 max-md:p-3 space-y-5 max-md:space-y-3 bg-slate-50/30 dark:bg-slate-900/50">
                    {!historyLoaded ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="animate-spin text-slate-300" size={28} />
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] max-md:max-w-[90%] flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                        {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                                    </div>
                                    <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-200 rounded-tl-none'}`}>
                                        {msg.file && (
                                            <div className={`flex items-center gap-1.5 mb-2 p-1.5 rounded-lg text-[11px] ${msg.role === 'user' ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
                                                <FileText size={12} />
                                                <span className="truncate max-w-[180px]">{msg.file}</span>
                                            </div>
                                        )}
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="flex gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex space-x-1.5 items-center">
                                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 max-md:p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 shrink-0 transition-colors">
                    <AnimatePresence>
                        {selectedFile && (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                                className="mb-2.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg flex items-center justify-between w-max max-w-full text-xs font-medium border border-blue-100 dark:border-blue-800/50">
                                <span className="flex items-center gap-1.5 truncate"><FileText size={14} /> {selectedFile.name}</span>
                                <button onClick={() => setSelectedFile(null)} className="ml-3 hover:bg-blue-100 p-0.5 rounded-full text-blue-500"><X size={12} /></button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <form onSubmit={handleSend} className="flex gap-2.5 items-center">
                        <label className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer rounded-xl transition-colors shrink-0">
                            <Paperclip size={20} />
                            <input type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập câu hỏi hoặc đính kèm tài liệu..."
                            className="flex-1 bg-slate-50 dark:bg-slate-800 border-none px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-primary-500/20 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm" />
                        <button type="submit" disabled={(!input.trim() && !selectedFile) || loading}
                            className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400 text-white p-2.5 rounded-xl transition-colors shrink-0 shadow-md shadow-primary-500/20 disabled:shadow-none">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AIPage;
