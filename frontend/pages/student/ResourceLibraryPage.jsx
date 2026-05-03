import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Download, Trash2, Search, Filter, X, FolderOpen, File, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

const CATEGORIES = ['Tất cả', 'Toán học', 'Vật Lý', 'Hóa học', 'Sinh học', 'Ngữ Văn', 'Tiếng Anh', 'Tin học'];
const GRADES = ['Tất cả', 'Cấp 1', 'Cấp 2', 'Cấp 3', 'Đại học'];

const FILE_ICONS = {
  pdf: { color: 'bg-red-500', label: 'PDF' },
  doc: { color: 'bg-blue-500', label: 'DOC' },
  docx: { color: 'bg-blue-500', label: 'DOCX' },
  ppt: { color: 'bg-orange-500', label: 'PPT' },
  pptx: { color: 'bg-orange-500', label: 'PPTX' },
  xls: { color: 'bg-emerald-500', label: 'XLS' },
  xlsx: { color: 'bg-emerald-500', label: 'XLSX' },
  txt: { color: 'bg-slate-500', label: 'TXT' },
  png: { color: 'bg-violet-500', label: 'PNG' },
  jpg: { color: 'bg-violet-500', label: 'JPG' },
};

export default function ResourceLibraryPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [activeSubject, setActiveSubject] = useState('Tất cả');
  const [activeGrade, setActiveGrade] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', subject_name: '', grade_level: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => { fetchResources(); }, [activeSubject, activeGrade, searchQuery]);

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams();
      if (activeSubject !== 'Tất cả') params.append('subject', activeSubject);
      if (activeGrade !== 'Tất cả') params.append('grade', activeGrade);
      if (searchQuery) params.append('search', searchQuery);
      const { data } = await axios.get(`${API}/api/resources/?${params}`);
      setResources(data);
    } catch (e) { console.error(e); }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadForm.title.trim()) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('user_id', user.id);
      fd.append('title', uploadForm.title);
      fd.append('description', uploadForm.description);
      fd.append('subject_name', uploadForm.subject_name);
      fd.append('grade_level', uploadForm.grade_level);
      fd.append('file', selectedFile);
      await axios.post(`${API}/api/resources/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowUpload(false);
      setSelectedFile(null);
      setUploadForm({ title: '', description: '', subject_name: '', grade_level: '' });
      fetchResources();
    } catch (e) { setErrorMessage(e.response?.data?.detail || 'Upload thất bại'); }
    setUploading(false);
  };

  const handleDownload = async (res) => {
    try {
      const { data } = await axios.get(`${API}/api/resources/${res.id}/download`);
      window.open(`${API}${data.file_url}`, '_blank');
      fetchResources();
    } catch (e) { console.error(e); }
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    try { await axios.delete(`${API}/api/resources/${itemToDelete}?user_id=${user.id}`); fetchResources(); } catch (e) { console.error(e); }
    setItemToDelete(null);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Thư viện tài liệu</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Chia sẻ và tải tài liệu học tập</p>
        </div>
        <button onClick={() => setShowUpload(true)}
          className="px-5 py-2.5 bg-primary-500 text-white rounded-xl font-bold text-sm hover:bg-primary-600 transition-colors flex items-center gap-2 shadow-lg shadow-primary-200">
          <Upload size={18} /> Upload tài liệu
        </button>
      </div>

      {/* Tìm kiếm */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm tài liệu..." className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none shadow-sm" />
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveSubject(c)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border
            ${activeSubject === c ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-slate-400'}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {GRADES.map(g => (
          <button key={g} onClick={() => setActiveGrade(g)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border
            ${activeGrade === g ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-slate-400'}`}>
            {g}
          </button>
        ))}
      </div>

      {/* Danh sách tài nguyên */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {resources.map((res, i) => {
            const fi = FILE_ICONS[res.file_type] || { color: 'bg-slate-500', label: res.file_type?.toUpperCase() || 'FILE' };
            return (
              <motion.div key={res.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: 0.03 * i }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all group">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 ${fi.color} rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                    {fi.label}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{res.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{res.uploader_name} • {formatSize(res.file_size)}</p>
                  </div>
                </div>
                {res.description && <p className="text-xs text-slate-500 mb-3 line-clamp-2">{res.description}</p>}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {res.subject_name && <span className="text-xs px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full font-bold">{res.subject_name}</span>}
                    <span className="text-xs text-slate-400">{res.download_count} lượt tải</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDownload(res)}
                      className="p-2 hover:bg-primary-50 rounded-lg text-primary-500 transition-colors"><Download size={16} /></button>
                    {res.user_id === user?.id && (
                      <button onClick={() => setItemToDelete(res.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors"><Trash2 size={16} /></button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {resources.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold">Chưa có tài liệu nào</p>
          <p className="text-sm mt-1">Hãy là người đầu tiên chia sẻ!</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowUpload(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Upload tài liệu</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Tiêu đề *</label>
                <input value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="Nhập tiêu đề" className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:border-primary-500 outline-none bg-white dark:bg-slate-700" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Môn học</label>
                <input value={uploadForm.subject_name} onChange={e => setUploadForm({ ...uploadForm, subject_name: e.target.value })}
                  placeholder="Nhập môn học..." className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:border-primary-500 outline-none bg-white dark:bg-slate-700" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Cấp học</label>
                <select value={uploadForm.grade_level} onChange={e => setUploadForm({ ...uploadForm, grade_level: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:border-primary-500 outline-none bg-white dark:bg-slate-700 bg-white">
                  <option value="">-- Chọn cấp --</option>
                  {GRADES.filter(g => g !== 'Tất cả').map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Mô tả</label>
                <textarea value={uploadForm.description} onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })}
                  rows={2} placeholder="Mô tả ngắn..." className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:border-primary-500 outline-none bg-white dark:bg-slate-700 resize-none" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">File *</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('file-input').click()}>
                  <input id="file-input" type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
                    onChange={e => setSelectedFile(e.target.files[0])} />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <File size={20} className="text-primary-500" />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{selectedFile.name}</span>
                      <button onClick={e => { e.stopPropagation(); setSelectedFile(null); }} className="text-slate-400 hover:text-red-500"><X size={16} /></button>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">Click để chọn file (tối đa 50MB)</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, PNG, JPG, TXT</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => { setShowUpload(false); setSelectedFile(null); }} className="flex-1 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700">Hủy</button>
              <button onClick={handleUpload} disabled={!uploadForm.title.trim() || !selectedFile || uploading}
                className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-bold text-sm hover:bg-primary-600 disabled:opacity-50 transition-colors">
                {uploading ? 'Đang upload...' : 'Upload'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Lỗi Modal */}
      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Đã có lỗi xảy ra</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage('')}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-xl transition-colors shadow-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Xóa tài liệu */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Xóa tài liệu?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Bạn có muốn xóa tài liệu này không?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/30"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
