import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { User, Lock, Image as ImageIcon, Save, CheckCircle, AlertCircle, Shield, School, Trash2 } from 'lucide-react';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        full_name: '',
        avatar_url: '',
        password: '',
        grade_level: '',
    });
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [deletePassword, setDeletePassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    const fileInputRef = useRef(null);

    const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API}/stms/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000
            });

            const data = response.data;
            setRoles(data.roles || []);

            setProfileData({
                username: data.username || '',
                email: data.email || '',
                full_name: data.full_name || '',
                avatar_url: data.avatar_url || '',
                password: '',
                grade_level: data.profile ? data.profile.grade_level : '',
            });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setMessage({ text: 'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!', type: 'error' });
            } else {
                setMessage({ text: 'Lỗi hệ thống, vui lòng thử lại sau!', type: 'error' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ text: '', type: '' });

        try {
            const token = localStorage.getItem('token');

            if (profileData.password) {
                if (!confirmPassword) {
                    setMessage({ text: 'Vui lòng nhập mật khẩu hiện tại để xác minh!', type: 'error' });
                    setIsSaving(false);
                    return;
                }
                try {
                    await axios.post(`${API}/stms/users/verify-password`, { password: confirmPassword }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } catch {
                    setMessage({ text: 'Mật khẩu hiện tại không đúng!', type: 'error' });
                    setIsSaving(false);
                    return;
                }
            }

            const updatePayload = {
                full_name: profileData.full_name,
                avatar_url: profileData.avatar_url,
                password: profileData.password
            };

            if (roles.includes('student')) {
                updatePayload.grade_level = profileData.grade_level;
            }

            await axios.put(`${API}/stms/users/me`, updatePayload, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000
            });

            setMessage({ text: 'Cập nhật hồ sơ thành công!', type: 'success' });
            setProfileData(prev => ({ ...prev, password: '' }));
            setConfirmPassword('');

        } catch (error) {
            console.error(error);
            setMessage({ text: 'Lỗi kết nối, vui lòng thử lại sau!', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setMessage({ text: 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP).', type: 'error' });
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ text: 'Dung lượng file không được vượt quá 2MB.', type: 'error' });
            return;
        }

        setIsUploading(true);
        setMessage({ text: '', type: '' });

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API}/stms/users/avatar`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 30000
            });

            setProfileData(prev => ({
                ...prev,
                avatar_url: response.data.avatar_url
            }));

            // Gửi sự kiện để cập nhật tiêu đề
            const event = new CustomEvent('avatarUpdated', {
                detail: { avatar_url: response.data.avatar_url }
            });
            window.dispatchEvent(event);

            setMessage({ text: 'Tải ảnh lên thành công.', type: 'success' });
        } catch (error) {
            console.error(error);
            setMessage({ text: error.response?.data?.detail || 'Lỗi tải ảnh lên, vui lòng thử lại!', type: 'error' });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const getRoleDisplayName = () => {
        if (roles.includes('admin')) return 'Quản trị viên Hệ thống';
        if (roles.includes('student')) return 'Học sinh';
        return 'Người dùng';
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            setMessage({ text: 'Vui lòng nhập mật khẩu để xác nhận xóa!', type: 'error' });
            return;
        }
        setIsDeleting(true);
        try {
            const token = localStorage.getItem('token');
            // Xác minh mật khẩu trước
            await axios.post(`${API}/stms/users/verify-password`, { password: deletePassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await axios.delete(`${API}/stms/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 15000
            });
            localStorage.clear();
            window.location.href = '/stms/login';
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.detail || 'Lỗi hệ thống, vui lòng thử lại!';
            setMessage({ text: msg, type: 'error' });
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
    }

    const renderAvatarPreview = () => {
        if (profileData.avatar_url) {
            return <img src={profileData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />;
        }
        const initial = profileData.full_name ? profileData.full_name.charAt(0) : profileData.username.charAt(0);
        return <div className="text-blue-600 font-bold text-2xl">{initial}</div>;
    };

    return (
        <div className="p-8 pb-20 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Hồ sơ của tôi</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý thông tin cá nhân và tài khoản</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl flex items-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.type === 'success' ? <CheckCircle className="mr-3" size={20} /> : <AlertCircle className="mr-3" size={20} />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="bg-white dark:bg-slate-800 dark:text-white rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="relative group">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden text-blue-600 font-bold text-3xl">
                                    {renderAvatarPreview()}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Thông tin cơ bản</h2>

                                <div className="flex items-center space-x-3">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/jpeg, image/png, image/gif, image/webp"
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAvatarClick}
                                        disabled={isUploading}
                                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mr-2"></div>
                                                Đang tải...
                                            </>
                                        ) : 'Tải ảnh lên'}
                                    </button>
                                    <span className="text-xs text-slate-500">Đề xuất tỉ lệ 1:1, &lt; 2MB</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Địa chỉ Email</label>
                            <input type="text" disabled value={profileData.email} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl py-2.5 px-4 text-slate-500 cursor-not-allowed" />
                        </div>

                        <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
                            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">Cập nhật thông tin</h3>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Họ và Tên</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    name="full_name"
                                    value={profileData.full_name}
                                    onChange={handleInputChange}
                                    placeholder="Nhập họ tên đầy đủ"
                                    className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl py-2.5 pl-10 pr-4 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-text"
                                />
                            </div>
                        </div>



                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mật khẩu mới</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={profileData.password}
                                    onChange={handleInputChange}
                                    placeholder=""
                                    className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl py-2.5 pl-10 pr-4 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-text"
                                />
                            </div>
                        </div>

                        {profileData.password && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mật khẩu hiện tại <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu hiện tại để xác minh"
                                        className="w-full bg-white dark:bg-slate-700 border border-amber-300 dark:border-amber-600 rounded-xl py-2.5 pl-10 pr-4 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-text"
                                    />
                                </div>
                                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5">Bắt buộc nhập để đổi mật khẩu</p>
                            </div>
                        )}
                    </div>
                </div>

                {roles.includes('student') && (
                    <div className="bg-white dark:bg-slate-800 dark:text-white rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Hồ sơ Học tập </h2>

                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Lớp / Khối</label>
                                <select
                                    name="grade_level"
                                    value={profileData.grade_level}
                                    onChange={handleInputChange}
                                    className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl py-2.5 px-4 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                >
                                    <option value="">-- Chọn lớp / cấp học --</option>
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i + 1} value={`Lớp ${i + 1}`}>Lớp {i + 1}</option>
                                    ))}
                                    <option value="Sinh viên">Sinh viên (Đại học / Cao đẳng)</option>
                                </select>
                            </div>

                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSaving ? (
                            <div className="flex items-center">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Đang lưu...
                            </div>
                        ) : (
                            <>
                                <Save size={18} className="mr-2" />
                                Lưu thay đổi
                            </>
                        )}
                    </button>
                </div>

            </form>

            {/* Danger*/}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-red-200 dark:border-red-900 overflow-hidden">
                <div className="p-6">
                    {!showDeleteConfirm ? (
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 border-2 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-400 transition-all"
                        >
                            <Trash2 size={16} className="mr-2" />
                            Xóa tài khoản
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Nhập mật khẩu để xác nhận xóa tài khoản:</p>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    className="w-full bg-white dark:bg-slate-700 border border-red-300 dark:border-red-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all cursor-text"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                    className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isDeleting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <><Trash2 size={16} className="mr-2" /> Xác nhận xóa</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
