import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, Search, Send, Hash, UserPlus, UserMinus, Check, X, Circle, ChevronRight, Plus, Lock, Globe, Menu, ArrowLeft, Paperclip, Image, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import socket from '@/lib/socket';
import ImageEditor from '@/components/UI/ImageEditor';

const API = import.meta.env.VITE_API_URL || '';

const TABS = [
  { id: 'group', label: 'Nhóm học', icon: Hash, path: '/stms/student/community/group' },
  { id: 'friends', label: 'Bạn học', icon: Users, path: '/stms/student/community/friends' },
];

export default function CommunityPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy activeTab từ đường dẫn URL
  const getTabFromPath = () => location.pathname.endsWith('/friends') ? 'friends' : 'group';
  const [activeTab, setActiveTab] = useState(getTabFromPath());
  const [channels, setChannels] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channelMessages, setChannelMessages] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [dmMessages, setDmMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelForm, setNewChannelForm] = useState({ subject_name: '', description: '', is_private: false });
  const [channelMembers, setChannelMembers] = useState([]);
  const [showMembersPanel, setShowMembersPanel] = useState(false);
  const [joinRequests, setJoinRequests] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showRecallConfirm, setShowRecallConfirm] = useState(null);
  const [showRemoveFriendConfirm, setShowRemoveFriendConfirm] = useState(null);
  const [showKickConfirm, setShowKickConfirm] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [chatFile, setChatFile] = useState(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editImageFile, setEditImageFile] = useState(null);
  const chatEnd = useRef(null);
  const selectedChannelRef = useRef(null);
  const selectedFriendRef = useRef(null);

  // Lấy activeTab từ đường dẫn URL
  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  useEffect(() => {
    if (!user?.id) return;
    socket.connect(user.id);
    fetchChannels();
    fetchFriends();
    fetchRequests();

    const unsub = socket.on('channel_message', (data) => {
      if (selectedChannelRef.current && data.channel_id === selectedChannelRef.current.id) {
        setChannelMessages(prev => [...prev, data]);
      }
    });
    const unsub2 = socket.on('direct_message', (data) => {
      if (selectedFriendRef.current && data.sender_id === selectedFriendRef.current.user_id) {
        setDmMessages(prev => [...prev, data]);
      }
    });

    const unsub3 = socket.on('channel_deleted', (data) => {
      setChannels(prev => prev.filter(c => c.id !== data.channel_id));
      if (selectedChannelRef.current?.id === data.channel_id) {
        setSelectedChannel(null);
        selectedChannelRef.current = null;
        setShowMembersPanel(false);
        setFeedbackModal({ type: 'success', message: 'Nhóm này vừa bị giải tán.' });
      }
    });

    const unsub4 = socket.on('member_kicked', (data) => {
      if (data.user_id === user.id) {
        setChannels(prev => prev.filter(c => c.id !== data.channel_id));
        if (selectedChannelRef.current?.id === data.channel_id) {
          setSelectedChannel(null);
          selectedChannelRef.current = null;
          setShowMembersPanel(false);
          setFeedbackModal({ type: 'error', message: 'Bạn đã bị mời ra khỏi nhóm.' });
        }
      } else {
        setChannelMembers(prev => prev.filter(m => m.user_id !== data.user_id));
      }
    });

    return () => { unsub(); unsub2(); unsub3(); unsub4(); };
  }, [user?.id]);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [channelMessages, dmMessages]);

  const fetchChannels = async () => {
    try {
      const { data } = await axios.get(`${API}/api/community/channels?user_id=${user.id}`);
      setChannels(data);
    } catch (e) { console.error(e); }
  };
  const fetchFriends = async () => {
    try {
      const { data } = await axios.get(`${API}/api/friends/my-friends?user_id=${user.id}`);
      setFriends(data);
    } catch (e) { console.error(e); }
  };
  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(`${API}/api/friends/requests?user_id=${user.id}`);
      setRequests(data);
    } catch (e) { console.error(e); }
  };

  const fetchChannelMembers = async (channelId) => {
    try {
      const { data } = await axios.get(`${API}/api/community/channels/${channelId}/members`);
      setChannelMembers(data);
    } catch (e) { console.error(e); }
  };
  const openChannel = async (ch) => {
    setSelectedChannel(ch);
    selectedChannelRef.current = ch;
    setSelectedFriend(null);
    selectedFriendRef.current = null;
    setShowMembersPanel(false);
    socket.joinRoom(`channel_${ch.id}`);
    try {
      const { data } = await axios.get(`${API}/api/community/channels/${ch.id}/messages`);
      setChannelMessages(data);
      fetchChannelMembers(ch.id);
      if (ch.is_private && ch.creator_id === user.id) {
        fetchJoinRequests(ch.id);
      }
    } catch (e) { console.error(e); }
  };
  const sendChannelMsg = async () => {
    if (!msgInput.trim() || !selectedChannel) return;
    const currentInput = msgInput.trim();
    setMsgInput('');
    try {
      const { data } = await axios.post(`${API}/api/community/channels/${selectedChannel.id}/messages?user_id=${user.id}&message=${encodeURIComponent(currentInput)}`);
      socket.send({
        type: 'channel_message',
        channel_id: selectedChannel.id,
        message: currentInput,
        id: data.id,
        username: user.username || user.full_name
      });
    } catch (e) {
      setMsgInput(currentInput);
      setFeedbackModal({ type: 'error', message: e.response?.data?.detail || 'Lỗi khi gửi tin nhắn' });
    }
  };

  const uploadFileToChat = async () => {
    if (!chatFile) return;
    const formData = new FormData();
    formData.append('file', chatFile);
    formData.append('user_id', user.id);
    formData.append('caption', msgInput.trim());
    try {
      if (selectedChannel) {
        const { data } = await axios.post(`${API}/api/community/channels/${selectedChannel.id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        // Add message locally for sender (WS will exclude_user for sender)
        const messageText = msgInput.trim() ? `${data.file_url}|||${msgInput.trim()}` : data.file_url;
        setChannelMessages(prev => [...prev, { id: data.id, user_id: user.id, username: user.username || user.full_name, message: messageText, message_type: data.message_type, created_at: new Date().toISOString() }]);
        socket.send({ type: 'channel_message', channel_id: selectedChannel.id, message: messageText, message_type: data.message_type, id: data.id, username: user.username || user.full_name });
      } else if (selectedFriend) {
        const { data } = await axios.post(`${API}/api/dm/${selectedFriend.user_id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        socket.sendDirectMessage(selectedFriend.user_id, data.file_url);
        setDmMessages(prev => [...prev, { id: data.id, sender_id: user.id, sender_name: user.username, message: data.file_url, message_type: data.message_type, created_at: new Date().toISOString() }]);
      }
      setChatFile(null);
      setMsgInput('');
    } catch (e) {
      setFeedbackModal({ type: 'error', message: e.response?.data?.detail || 'Lỗi khi gửi file' });
    }
  };

  // Xử lý chọn file - nếu là ảnh thì mở ImageEditor
  const handleChatFileSelect = (file) => {
    if (!file) return;
    const ext = file.name.toLowerCase().split('.').pop();
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'].includes(ext)) {
      setEditImageFile(file);
      setShowImageEditor(true);
    } else {
      setChatFile(file);
    }
  };

  // Gửi ảnh đã chỉnh sửa từ ImageEditor
  const handleEditorSend = async (editedBlob, caption) => {
    setShowImageEditor(false);
    setEditImageFile(null);
    const editedFile = new File([editedBlob], `edited_${Date.now()}.png`, { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', editedFile);
    formData.append('user_id', user.id);
    formData.append('caption', caption || '');
    try {
      if (selectedChannel) {
        const { data } = await axios.post(`${API}/api/community/channels/${selectedChannel.id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        const messageText = caption ? `${data.file_url}|||${caption}` : data.file_url;
        setChannelMessages(prev => [...prev, { id: data.id, user_id: user.id, username: user.username || user.full_name, message: messageText, message_type: data.message_type, created_at: new Date().toISOString() }]);
        socket.send({ type: 'channel_message', channel_id: selectedChannel.id, message: messageText, message_type: data.message_type, id: data.id, username: user.username || user.full_name });
      } else if (selectedFriend) {
        const { data } = await axios.post(`${API}/api/dm/${selectedFriend.user_id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        socket.sendDirectMessage(selectedFriend.user_id, data.file_url);
        setDmMessages(prev => [...prev, { id: data.id, sender_id: user.id, sender_name: user.username, message: data.file_url, message_type: data.message_type, created_at: new Date().toISOString() }]);
      }
    } catch (e) {
      setFeedbackModal({ type: 'error', message: e.response?.data?.detail || 'Lỗi khi gửi ảnh' });
    }
  };

  const openDM = async (friend) => {
    setSelectedFriend(friend);
    selectedFriendRef.current = friend;
    setSelectedChannel(null);
    selectedChannelRef.current = null;
    try {
      const { data } = await axios.get(`${API}/api/dm/${friend.user_id}/messages?user_id=${user.id}`);
      setDmMessages(data);
    } catch (e) { console.error(e); }
  };
  const sendDM = async () => {
    if (!msgInput.trim() || !selectedFriend) return;
    const currentInput = msgInput.trim();
    setMsgInput('');
    try {
      await axios.post(`${API}/api/dm/${selectedFriend.user_id}/send?user_id=${user.id}&message=${encodeURIComponent(currentInput)}`);
      socket.sendDirectMessage(selectedFriend.user_id, currentInput);
      setDmMessages(prev => [...prev, { id: Date.now(), sender_id: user.id, sender_name: user.username, message: currentInput, created_at: new Date().toISOString() }]);
    } catch (e) {
      setMsgInput(currentInput);
      setFeedbackModal({ type: 'error', message: e.response?.data?.detail || 'Lỗi khi gửi tin nhắn' });
    }
  };

  const handleCreateChannel = async () => {
    if (!newChannelForm.subject_name.trim()) return;
    try {
      await axios.post(`${API}/api/community/channels/create?user_id=${user.id}`, newChannelForm);
      setShowCreateChannel(false);
      setNewChannelForm({ subject_name: '', description: '', is_private: false });
      fetchChannels();
    } catch (e) {
      console.error(e);
    }
  };

  const joinChannel = async (ch) => {
    try {
      const { data } = await axios.post(`${API}/api/community/channels/${ch.id}/join?user_id=${user.id}`);
      setFeedbackModal({ type: 'success', message: data.message });
      fetchChannels();
    } catch (e) {
      setFeedbackModal({ type: 'error', message: e.response?.data?.detail || 'Lỗi tham gia nhóm' });
    }
  };

  const fetchJoinRequests = async (channelId) => {
    try {
      const { data } = await axios.get(`${API}/api/community/channels/${channelId}/join-requests?user_id=${user.id}`);
      setJoinRequests(data);
    } catch (e) { setJoinRequests([]); }
  };

  const handleAcceptJoinRequest = async (channelId, requestId) => {
    try {
      await axios.put(`${API}/api/community/channels/${channelId}/join-requests/${requestId}/accept?user_id=${user.id}`);
      setFeedbackModal({ type: 'success', message: 'Đã chấp nhận yêu cầu tham gia!' });
      fetchJoinRequests(channelId);
      fetchChannelMembers(channelId);
    } catch (e) {
      setFeedbackModal({ type: 'error', message: e.response?.data?.detail || 'Lỗi' });
    }
  };

  const handleRejectJoinRequest = async (channelId, requestId) => {
    try {
      await axios.put(`${API}/api/community/channels/${channelId}/join-requests/${requestId}/reject?user_id=${user.id}`);
      setFeedbackModal({ type: 'success', message: 'Đã từ chối yêu cầu.' });
      fetchJoinRequests(channelId);
    } catch (e) {
      setFeedbackModal({ type: 'error', message: e.response?.data?.detail || 'Lỗi' });
    }
  };

  const executeDeleteChannel = async () => {
    if (!showDeleteConfirm) return;
    try {
      await axios.delete(`${API}/api/community/channels/${showDeleteConfirm}?user_id=${user.id}`);
      socket.send({ type: 'channel_deleted', channel_id: showDeleteConfirm });
      setSelectedChannel(null);
      setShowMembersPanel(false);
      setShowDeleteConfirm(null);
      fetchChannels();
    } catch (e) {
      setFeedbackModal({ type: 'error', message: e.response?.data?.detail || "Lỗi xóa nhóm." });
    }
  };

  const handleKickMember = (memberId) => {
    setShowKickConfirm(memberId);
  };

  const executeKickMember = async () => {
    if (!showKickConfirm) return;
    try {
      await axios.delete(`${API}/api/community/channels/${selectedChannel.id}/members/${showKickConfirm}?user_id=${user.id}`);
      fetchChannelMembers(selectedChannel.id);
      setShowKickConfirm(null);
    } catch (e) {
      setFeedbackModal({ type: 'error', message: e.response?.data?.detail || "Lỗi xóa thành viên." });
      setShowKickConfirm(null);
    }
  };

  const handleDeleteMessage = (msgId) => {
    setShowRecallConfirm(msgId);
  };

  const executeRecallMessage = async () => {
    if (!showRecallConfirm) return;
    try {
      if (selectedChannel) {
        await axios.delete(`${API}/api/community/channels/${selectedChannel.id}/messages/${showRecallConfirm}?user_id=${user.id}`);
        setChannelMessages(prev => prev.map(m => m.id === showRecallConfirm ? { ...m, message: "Tin nhắn đã bị thu hồi", message_type: "recalled" } : m));
      }
      setShowRecallConfirm(null);
    } catch (e) {
      setFeedbackModal({ type: 'error', message: e.response?.data?.detail || "Lỗi thu hồi tin nhắn." });
      setShowRecallConfirm(null);
    }
  };

  const sendFriendRequestFromGroup = async (targetId) => {
    try {
      await axios.post(`${API}/api/friends/requests`, { receiver_id: targetId, message: "Chào bạn, mình muốn kết bạn từ nhóm!" }, { params: { user_id: user.id } });
      setFeedbackModal({ type: 'success', message: "Đã gửi lời mời kết bạn!" });
    } catch (e) {
      setFeedbackModal({ type: 'error', message: e.response?.data?.detail || "Không thể gửi lời mời hoặc đã gửi rồi." });
    }
  };

  const acceptRequest = async (reqId) => {
    await axios.put(`${API}/api/friends/request/${reqId}/accept`);
    fetchRequests(); fetchFriends();
  };
  const rejectRequest = async (reqId) => {
    await axios.put(`${API}/api/friends/request/${reqId}/reject`);
    fetchRequests();
  };

  const removeFriend = async (friendId, e) => {
    e.stopPropagation();
    setShowRemoveFriendConfirm(friendId);
  };

  const executeRemoveFriend = async () => {
    const friendId = showRemoveFriendConfirm;
    setShowRemoveFriendConfirm(null);
    try {
      await axios.delete(`${API}/api/friends/${friendId}?user_id=${user.id}`);
      setFriends(friends.filter(b => b.user_id !== friendId));
      if (selectedFriend?.user_id === friendId) {
        setSelectedFriend(null);
        selectedFriendRef.current = null;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const chatActive = selectedChannel || selectedFriend;

  return (
    <div className="flex h-[calc(100vh-64px)] -mt-8 -mx-8 bg-slate-50 dark:bg-slate-950 relative">
      {/* Mobile overlay */}
      {showLeftPanel && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden" onClick={() => setShowLeftPanel(false)} />}
      {/* PANEL TRÁI */}
      <div className={`w-80 max-md:w-[300px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-40 max-md:shadow-2xl transition-transform ${showLeftPanel ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}`}>
        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          {TABS.map(t => (
            <button key={t.id} onClick={() => navigate(t.path)}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors
              ${activeTab === t.id ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* Lời mời */}
        {requests.length > 0 && activeTab === 'friends' && (
          <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-amber-50 dark:bg-amber-900/20">
            <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">Lời mời ({requests.length})</h3>
            {requests.map(r => (
              <div key={r.id} className="flex items-center gap-2 py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                  {r.sender_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{r.sender_name}</p>
                </div>
                <button onClick={() => acceptRequest(r.id)} className="p-1.5 bg-emerald-500 rounded-full text-white hover:bg-emerald-600"><Check size={12} /></button>
                <button onClick={() => rejectRequest(r.id)} className="p-1.5 bg-slate-300 rounded-full text-white hover:bg-slate-400"><X size={12} /></button>
              </div>
            ))}
          </div>
        )}

        {/* Nội dung */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'group' && (
            <div className="p-3">
              <button onClick={() => setShowCreateChannel(true)} className="w-full py-2 bg-primary-50 text-primary-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-100 transition-colors">
                <Plus size={16} /> Tạo nhóm mới
              </button>
            </div>
          )}
          {activeTab === 'group' && channels.map(ch => (
            <button key={ch.id} onClick={() => { ch.is_joined ? openChannel(ch) : joinChannel(ch); setShowLeftPanel(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800
              ${selectedChannel?.id === ch.id ? 'bg-primary-50 dark:bg-primary-900/20 border-l-3 border-l-primary-500' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {ch.subject_name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  {ch.subject_name}
                  {ch.is_private && <Lock size={12} className="text-amber-500" />}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{ch.member_count} thành viên{ch.is_private ? ' • Riêng tư' : ''}</p>
              </div>
              {!ch.is_joined && !ch.pending_request && (
                <span className="text-xs px-2 py-1 bg-primary-100 text-primary-600 rounded-full font-bold">
                  {ch.is_private ? 'Xin tham gia' : 'Tham gia'}
                </span>
              )}
              {!ch.is_joined && ch.pending_request && (
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-600 rounded-full font-bold">Đang chờ</span>
              )}
              {ch.is_joined && <ChevronRight size={14} className="text-slate-400" />}
            </button>
          ))}

          {activeTab === 'friends' && friends.map(b => (
            <div key={b.user_id} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 group cursor-pointer
              ${selectedFriend?.user_id === b.user_id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
              onClick={() => { openDM(b); setShowLeftPanel(false); }}>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                  {(b.full_name || b.username)?.[0]}
                </div>
                <Circle size={10} className="absolute -bottom-0.5 -right-0.5 text-emerald-500 fill-emerald-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{b.full_name || b.username}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{b.school_name || 'EduFlow'}</p>
              </div>
              <button
                onClick={(e) => removeFriend(b.user_id, e)}
                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="Xóa bạn"
              >
                <UserMinus size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* KHU VỰC CHAT */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        {chatActive ? (
          <>
            {/* Header */}
            <div className="px-6 max-md:px-4 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button onClick={() => { setSelectedChannel(null); setSelectedFriend(null); setShowLeftPanel(true); }} className="md:hidden p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
                  <ArrowLeft size={20} />
                </button>
                {selectedChannel && <><div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">{selectedChannel.subject_name?.[0]?.toUpperCase()}</div><div><h2 className="font-bold text-slate-800 dark:text-white">{selectedChannel.subject_name}</h2><p className="text-xs text-slate-500">{selectedChannel.member_count} thành viên</p></div></>}
                {selectedFriend && <><div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">{(selectedFriend.full_name || selectedFriend.username)?.[0]?.toUpperCase()}</div><div><h2 className="font-bold text-slate-800 dark:text-white">{selectedFriend.full_name || selectedFriend.username}</h2><p className="text-xs text-emerald-500 font-medium">Đang hoạt động</p></div></>}
              </div>

              <div className="flex items-center gap-2">
                {selectedChannel && selectedChannel.creator_id === user.id && (
                  <button onClick={() => setShowDeleteConfirm(selectedChannel.id)} className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                    Xóa nhóm
                  </button>
                )}
                {selectedChannel && (
                  <button onClick={() => setShowMembersPanel(!showMembersPanel)}
                    className={`p-2 rounded-xl transition-colors ${showMembersPanel ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    <Users size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* KHU VỰC CHAT */}
              <div className="flex-1 flex flex-col">
                {/* TIN NHẮN */}
                <div className="flex-1 overflow-y-auto p-6 max-md:p-3 space-y-4">
                  {(selectedChannel ? channelMessages : dmMessages).map((msg, i) => {
                    const isMe = msg.user_id === user.id || msg.sender_id === user.id;
                    return (
                      <div key={msg.id || i} className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold
                      ${isMe ? 'bg-primary-500' : 'bg-slate-400'}`}>
                          {(msg.username || msg.sender_name || '?')[0]}
                        </div>
                        <div className={`max-w-[60%] flex gap-2 ${isMe ? 'items-end flex-row-reverse' : ''}`}>
                          <div className={`flex flex-col ${isMe ? 'items-end' : ''}`}>
                            {!isMe && <p className="text-xs font-semibold text-slate-500 mb-1">{msg.username || msg.sender_name}</p>}

                            {msg.message_type === 'recalled' ? (
                              <div className={`px-4 py-2.5 rounded-2xl text-sm italic border
                            ${isMe ? 'border-slate-300 text-slate-400 rounded-br-md dark:border-slate-700' : 'border-slate-300 text-slate-400 rounded-bl-md dark:border-slate-700'}`}>
                                Tin nhắn đã bị thu hồi
                              </div>
                            ) : msg.message_type === 'image' ? (
                              <div className={`rounded-2xl overflow-hidden max-w-xs ${isMe ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                                <img src={`${API}${msg.message.split('|||')[0]}`} alt="" className="w-full max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(`${API}${msg.message.split('|||')[0]}`, '_blank')} />
                                {msg.message.includes('|||') && <p className={`px-3 py-1.5 text-xs ${isMe ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>{msg.message.split('|||')[1]}</p>}
                              </div>
                            ) : msg.message_type === 'file' ? (
                              <a href={`${API}${msg.message.split('|||')[0]}`} target="_blank" rel="noreferrer"
                                className={`px-4 py-2.5 rounded-2xl text-sm flex items-center gap-2 ${isMe ? 'bg-primary-500 text-white rounded-br-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-md'}`}>
                                <FileText size={16} /> {msg.message.split('|||')[0].split('/').pop()}
                              </a>
                            ) : (
                              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                            ${isMe ? 'bg-primary-500 text-white rounded-br-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-md'}`}>
                                {msg.message}
                              </div>
                            )}
                          </div>

                          {/* XÓA TIN NHẮN */}
                          {msg.message_type !== 'recalled' && isMe && msg.id && (
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="opacity-0 group-hover:opacity-100 text-[10px] font-semibold text-slate-400 hover:text-red-500 transition-all self-center px-1 py-1"
                              title="Thu hồi tin nhắn"
                            >
                              Thu hồi
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEnd} />
                </div>

                {/* NHẬP TIN NHẮN */}
                <div className="px-6 max-md:px-3 py-4 max-md:py-3 border-t border-slate-200 dark:border-slate-800">
                  {chatFile && (
                    <div className="mb-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg flex items-center justify-between w-max max-w-full text-xs font-medium border border-blue-100 dark:border-blue-800/50">
                      <span className="flex items-center gap-1.5 truncate"><FileText size={14} /> {chatFile.name}</span>
                      <button onClick={() => setChatFile(null)} className="ml-3 hover:bg-blue-100 dark:hover:bg-blue-800 p-0.5 rounded-full"><X size={12} /></button>
                    </div>
                  )}
                  <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-2">
                    <label className="p-1.5 text-slate-400 hover:text-primary-500 cursor-pointer rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Đính kèm file">
                      <Paperclip size={18} />
                      <input type="file" className="hidden" onChange={e => { if (e.target.files?.[0]) handleChatFileSelect(e.target.files[0]); e.target.value = ''; }} />
                    </label>
                    <input value={msgInput} onChange={e => setMsgInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (chatFile ? uploadFileToChat() : (selectedChannel ? sendChannelMsg() : sendDM()))}
                      placeholder={chatFile ? 'Thêm chú thích (không bắt buộc)...' : 'Nhập tin nhắn...'} className="flex-1 bg-transparent outline-none text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400" />
                    <button onClick={chatFile ? uploadFileToChat : (selectedChannel ? sendChannelMsg : sendDM)}
                      className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Members Panel */}
              {showMembersPanel && selectedChannel && (
                <div className="w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white">Thành viên ({channelMembers.length})</h3>
                    <button onClick={() => setShowMembersPanel(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={16} /></button>
                  </div>

                  {/* Yêu cầu tham gia nhóm */}
                  {selectedChannel.is_private && selectedChannel.creator_id === user.id && joinRequests.length > 0 && (
                    <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-amber-50 dark:bg-amber-900/20">
                      <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">Yêu cầu tham gia ({joinRequests.length})</h4>
                      {joinRequests.map(r => (
                        <div key={r.id} className="flex items-center gap-2 py-1.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {(r.full_name || r.username)?.[0]?.toUpperCase()}
                          </div>
                          <p className="flex-1 text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{r.full_name || r.username}</p>
                          <button onClick={() => handleAcceptJoinRequest(selectedChannel.id, r.id)} className="p-1 bg-emerald-500 rounded-full text-white hover:bg-emerald-600"><Check size={10} /></button>
                          <button onClick={() => handleRejectJoinRequest(selectedChannel.id, r.id)} className="p-1 bg-slate-300 rounded-full text-white hover:bg-slate-400"><X size={10} /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {channelMembers.map(m => {
                      const isMe = String(m.user_id) === String(user.id);
                      const isFriend = friends.some(b => String(b.user_id) === String(m.user_id));
                      const isCreator = String(selectedChannel.creator_id) === String(user.id);

                      return (
                        <div key={m.user_id} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg group transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {(m.full_name || m.username)?.[0]?.toUpperCase()}
                            </div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[100px]" title={m.full_name || m.username}>
                              {m.full_name || m.username} {isMe && <span className="text-xs text-slate-400 font-normal ml-1">(Tôi)</span>}
                            </p>
                          </div>
                          {!isMe && !isFriend && (
                            <button
                              onClick={() => sendFriendRequestFromGroup(m.user_id)}
                              className="p-1.5 opacity-0 group-hover:opacity-100 bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 rounded transition-all"
                              title="Thêm bạn"
                            >
                              <UserPlus size={14} />
                            </button>
                          )}
                          {/* XÓA THÀNH VIÊN */}
                          {isCreator && !isMe && (
                            <button
                              onClick={() => setShowKickConfirm(m.user_id)}
                              className="px-2 py-1 text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-500 hover:text-white rounded transition-colors ml-1"
                              title="Kích khỏi nhóm"
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center px-4">
              <button onClick={() => setShowLeftPanel(true)} className="md:hidden mb-6 px-4 py-2 bg-primary-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 mx-auto">
                <Menu size={16} /> Xem danh sách
              </button>
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="text-slate-400" size={40} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Chào mừng đến Cộng đồng EduFlow</h2>

            </div>
          </div>
        )}
      </div>

      {/* Modal tạo nhóm */}
      {showCreateChannel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateChannel(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Tạo Nhóm học mới</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Tên nhóm / Chủ đề *</label>
                <input value={newChannelForm.subject_name} onChange={e => setNewChannelForm({ ...newChannelForm, subject_name: e.target.value })}
                  placeholder="Nhập tên nhóm..." className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:border-primary-500 outline-none bg-white dark:bg-slate-700" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Mô tả ngắn</label>
                <textarea value={newChannelForm.description} onChange={e => setNewChannelForm({ ...newChannelForm, description: e.target.value })}
                  placeholder="Mô tả nhóm..." rows={2} className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:border-primary-500 outline-none resize-none bg-white dark:bg-slate-700" />
              </div>
              {/* Toggler Riêng tư */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="flex items-center gap-2">
                  {newChannelForm.is_private ? <Lock size={16} className="text-amber-500" /> : <Globe size={16} className="text-emerald-500" />}
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{newChannelForm.is_private ? 'Nhóm riêng tư' : 'Nhóm công khai'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{newChannelForm.is_private ? 'Cần duyệt mới được vào' : 'Ai cũng có thể tham gia'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setNewChannelForm({ ...newChannelForm, is_private: !newChannelForm.is_private })}
                  className={`w-12 h-7 rounded-full transition-colors relative ${newChannelForm.is_private ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${newChannelForm.is_private ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowCreateChannel(false)} className="flex-1 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700">Hủy</button>
              <button onClick={handleCreateChannel} disabled={!newChannelForm.subject_name.trim()}
                className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-bold text-sm hover:bg-primary-600 disabled:opacity-50 transition-colors">Tạo nhóm</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal xác nhận xóa nhóm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Xóa Nhóm học</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Bạn có muốn xóa nhóm?</p>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700">Hủy</button>
              <button onClick={executeDeleteChannel}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors">Xóa Nhóm</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal xác nhận thu hồi tin nhắn */}
      {showRecallConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowRecallConfirm(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-3xl p-8 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">Thu hồi tin nhắn</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Bạn có muốn thu hồi tin nhắn?</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowRecallConfirm(null)} className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700">Hủy</button>
              <button onClick={executeRecallMessage}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors">Xác nhận</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal xác nhận xóa bạn */}
      {showRemoveFriendConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowRemoveFriendConfirm(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-3xl p-8 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">Xóa bạn bè</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Bạn có muốn xóa khỏi danh sách bạn?</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowRemoveFriendConfirm(null)} className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700">Hủy</button>
              <button onClick={executeRemoveFriend}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors">Xóa</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal xác nhận xóa thành viên */}
      {showKickConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowKickConfirm(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-3xl p-8 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">Xóa thành viên</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Bạn có muốn xóa thành viên này ra khỏi nhóm?</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowKickConfirm(null)} className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700">Hủy</button>
              <button onClick={executeKickMember}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors">Xóa</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal thông báo chung */}
      {feedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setFeedbackModal(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${feedbackModal.type === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
              {feedbackModal.type === 'success' ? <Check size={32} /> : <X size={32} />}
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              {feedbackModal.type === 'success' ? 'Thành công' : 'Thông báo'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{feedbackModal.message}</p>
            <button onClick={() => setFeedbackModal(null)}
              className="w-full py-3 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-bold text-sm hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors">
              Đóng
            </button>
          </motion.div>
        </div>
      )}

      {/* Image Editor Modal */}
      {showImageEditor && editImageFile && (
        <ImageEditor
          imageFile={editImageFile}
          onSend={handleEditorSend}
          onClose={() => { setShowImageEditor(false); setEditImageFile(null); }}
        />
      )}
    </div>
  );
}
