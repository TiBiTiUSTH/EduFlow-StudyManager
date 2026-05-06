import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Copy, Video, LogOut, Mic, MicOff, VideoOff, PhoneOff, MonitorUp, StopCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import socket from '@/lib/socket';

const API = import.meta.env.VITE_API_URL || '';

const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

function RemoteVideo({ stream, name }) {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  if (!stream) return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-700 flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-inner">
        {name?.[0]}
      </div>
    </div>
  );
  return <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />;
}

export default function StudyRoomDetailPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hostLeftPopup, setHostLeftPopup] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const streamReadyRef = useRef(false);

  const peers = useRef({});
  const iceQueue = useRef({});
  const pendingPeers = useRef([]);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [remoteMediaStatus, setRemoteMediaStatus] = useState({});

  const attachLocalVideo = useCallback(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, []);

  // Tính toán grid class dựa trên số người
  const totalParticipants = useMemo(() => {
    const remoteCount = members.filter(m => m.user_id !== user?.id).length;
    return 1 + remoteCount; // local + remotes
  }, [members, user?.id]);

  const getGridClass = useCallback(() => {
    if (totalParticipants <= 1) return 'grid-cols-1';
    if (totalParticipants === 2) return 'grid-cols-2';
    if (totalParticipants <= 4) return 'grid-cols-2 grid-rows-2';
    return 'grid-cols-3';
  }, [totalParticipants]);

  const getVideoAspect = useCallback(() => {
    if (totalParticipants <= 1) return 'aspect-video max-w-4xl mx-auto';
    if (totalParticipants === 2) return 'aspect-video';
    return '';
  }, [totalParticipants]);

  useEffect(() => {
    if (!user?.id || !roomId) return;

    socket.connect(user.id);

    const createPeer = (remoteUserId, initiator) => {
      if (peers.current[remoteUserId]) {
        peers.current[remoteUserId].close();
        delete peers.current[remoteUserId];
      }

      const peer = new RTCPeerConnection(rtcConfig);

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          peer.addTrack(track, localStreamRef.current);
        });
      }

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.send({ type: 'webrtc_ice_candidate', receiver_id: remoteUserId, candidate: event.candidate });
        }
      };

      peer.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStreams(prev => ({ ...prev, [remoteUserId]: event.streams[0] }));
        }
      };

      peer.oniceconnectionstatechange = () => {
        if (peer.iceConnectionState === 'failed') {
          peer.restartIce();
        }
      };

      if (initiator) {
        peer.createOffer()
          .then(offer => peer.setLocalDescription(offer))
          .then(() => {
            socket.send({ type: 'webrtc_offer', receiver_id: remoteUserId, offer: peer.localDescription });
          })
          .catch(err => console.error("Create offer error", err));
      }

      peers.current[remoteUserId] = peer;
      return peer;
    };

    const processIceQueue = async (peer, remoteUserId) => {
      if (iceQueue.current[remoteUserId]) {
        for (const candidate of iceQueue.current[remoteUserId]) {
          try {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) { /* bỏ qua lỗi ICE đã hết hạn */ }
        }
        delete iceQueue.current[remoteUserId];
      }
    };

    const initRoom = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          localStreamRef.current = stream;
          streamReadyRef.current = true;
          attachLocalVideo();
        } catch (err) {
          console.error("Media error:", err);
          setIsVideoOff(true);
          setIsMuted(true);
          streamReadyRef.current = true;
        }
      } else {
        setIsVideoOff(true);
        setIsMuted(true);
        streamReadyRef.current = true;
      }

      socket.joinRoom(roomId);
      fetchRoom();
      fetchMembers();

      // Tạo peer cho những user đã join trước khi stream sẵn sàng
      if (pendingPeers.current.length > 0) {
        for (const userId of pendingPeers.current) {
          if (!peers.current[userId]) {
            createPeer(userId, true);
          }
        }
        pendingPeers.current = [];
      }
    };

    initRoom();

    const unsubJoined = socket.on('user_joined', (data) => {
      fetchMembers();
      if (data.user_id !== user.id) {
        if (streamReadyRef.current) {
          // Stream sẵn sàng → tạo peer ngay
          if (!peers.current[data.user_id]) {
            setTimeout(() => createPeer(data.user_id, true), 300);
          }
        } else {
          // Stream chưa sẵn sàng → đợi
          pendingPeers.current.push(data.user_id);
        }
      }
    });

    const unsubLeft = socket.on('user_left', (data) => {
      fetchMembers();
      if (peers.current[data.user_id]) {
        peers.current[data.user_id].close();
        delete peers.current[data.user_id];
      }
      delete iceQueue.current[data.user_id];
      setRemoteStreams(prev => {
        const next = { ...prev };
        delete next[data.user_id];
        return next;
      });
      setRemoteMediaStatus(prev => {
        const next = { ...prev };
        delete next[data.user_id];
        return next;
      });
    });

    const unsubMediaStatus = socket.on('media_status', (data) => {
      if (data.user_id && data.user_id !== user.id) {
        setRemoteMediaStatus(prev => ({
          ...prev,
          [data.user_id]: { muted: data.muted, videoOff: data.videoOff }
        }));
      }
    });

    const unsubOffer = socket.on('webrtc_offer', async (data) => {
      if (data.sender_id === user.id) return;
      const peer = createPeer(data.sender_id, false);
      try {
        await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
        await processIceQueue(peer, data.sender_id);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.send({ type: 'webrtc_answer', receiver_id: data.sender_id, answer: peer.localDescription });
      } catch (err) { console.error("Offer handle error", err); }
    });

    const unsubAnswer = socket.on('webrtc_answer', async (data) => {
      const peer = peers.current[data.sender_id];
      if (peer) {
        try {
          await peer.setRemoteDescription(new RTCSessionDescription(data.answer));
          await processIceQueue(peer, data.sender_id);
        } catch (err) { console.error("Answer handle error", err); }
      }
    });

    const unsubIce = socket.on('webrtc_ice_candidate', async (data) => {
      const peer = peers.current[data.sender_id];
      if (peer && peer.remoteDescription && peer.remoteDescription.type) {
        try {
          await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) { /* bỏ qua */ }
      } else {
        if (!iceQueue.current[data.sender_id]) iceQueue.current[data.sender_id] = [];
        iceQueue.current[data.sender_id].push(data.candidate);
      }
    });

    const unsubClosed = socket.on('room_closed', (data) => {
      if (String(data.room_id) === String(roomId)) {
        setHostLeftPopup(true);
      }
    });

    return () => {
      unsubJoined(); unsubLeft(); unsubClosed(); unsubMediaStatus();
      unsubOffer(); unsubAnswer(); unsubIce();
      socket.leaveRoom(roomId);
      Object.values(peers.current).forEach(p => p.close());
      peers.current = {};
      streamReadyRef.current = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
    };
  }, [user?.id, roomId]);

  useEffect(() => {
    attachLocalVideo();
  }, [isVideoOff, isScreenSharing, attachLocalVideo]);

  const fetchRoom = async () => {
    try { const { data } = await axios.get(`${API}/api/room/${roomId}`); setRoom(data); } catch (e) { console.error(e); }
  };

  const fetchMembers = async () => {
    try { const { data } = await axios.get(`${API}/api/room/${roomId}/members`); setMembers(data); } catch (e) { console.error(e); }
  };

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) return;
    const newEnabled = !audioTracks[0].enabled;
    audioTracks.forEach(track => { track.enabled = newEnabled; });
    const nowMuted = !newEnabled;
    setIsMuted(nowMuted);
    socket.send({ type: 'media_status', room_id: roomId, muted: nowMuted, videoOff: isVideoOff });
  }, [roomId, isVideoOff]);

  const toggleVideo = useCallback(() => {
    if (isScreenSharing) return;
    const stream = localStreamRef.current;
    if (!stream) return;
    const videoTracks = stream.getVideoTracks();
    if (videoTracks.length === 0) return;
    const newEnabled = !videoTracks[0].enabled;
    videoTracks.forEach(track => { track.enabled = newEnabled; });
    const nowVideoOff = !newEnabled;
    setIsVideoOff(nowVideoOff);
    socket.send({ type: 'media_status', room_id: roomId, muted: isMuted, videoOff: nowVideoOff });
  }, [isScreenSharing, roomId, isMuted]);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      try {
        const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const camTrack = camStream.getVideoTracks()[0];
        const currentStream = localStreamRef.current;

        if (currentStream) {
          currentStream.getVideoTracks().forEach(t => t.stop());
          currentStream.removeTrack(currentStream.getVideoTracks()[0]);
          currentStream.addTrack(camTrack);
        }

        Object.values(peers.current).forEach(peer => {
          const sender = peer.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender) sender.replaceTrack(camTrack);
        });

        setIsScreenSharing(false);
        setIsVideoOff(false);
        attachLocalVideo();
      } catch (err) {
        console.error("Camera restore error", err);
      }
    } else {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const displayTrack = displayStream.getVideoTracks()[0];
        const currentStream = localStreamRef.current;

        if (currentStream) {
          currentStream.getVideoTracks().forEach(t => t.stop());
          const oldVideoTrack = currentStream.getVideoTracks()[0];
          if (oldVideoTrack) currentStream.removeTrack(oldVideoTrack);
          currentStream.addTrack(displayTrack);
        }

        Object.values(peers.current).forEach(peer => {
          const sender = peer.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender) sender.replaceTrack(displayTrack);
        });

        displayTrack.onended = () => {
          toggleScreenShare();
        };

        setIsScreenSharing(true);
        setIsVideoOff(false);
        attachLocalVideo();
      } catch (e) {
        console.error("Screen share error", e);
      }
    }
  }, [isScreenSharing, attachLocalVideo]);

  const leaveRoom = async () => {
    try {
      const { data } = await axios.post(`${API}/api/room/${roomId}/leave?user_id=${user?.id}`);
      if (data.room_deleted) {
        socket.send({ type: 'room_closed', room_id: roomId });
      }
    } catch (e) { console.error(e); }
    navigate('/stms/student/room');
  };

  const copyCode = () => {
    if (room && room.room_code) {
        try {
            if (navigator && navigator.clipboard) {
                navigator.clipboard.writeText(room.room_code);
            } else {
                const el = document.createElement('textarea');
                el.value = room.room_code;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
            }
        } catch (e) {
            console.error('Clipboard copy error:', e);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!room) return <div className="flex items-center justify-center h-96"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;

  const remoteMembers = members.filter(m => m.user_id !== user?.id);

  return (
    <div className="flex h-[calc(100vh-64px)] -mt-4 md:-mt-8 -mx-4 md:-mx-8">
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 min-w-0">
        {/* Header bar */}
        <div className="px-3 md:px-6 py-3 md:py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 md:gap-4 shrink-0">
          <button onClick={() => navigate('/stms/student/room')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0">
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-slate-800 dark:text-white text-sm md:text-base truncate">{room.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{room.subject_name || 'Tổng hợp'} • {members.length} thành viên</p>
          </div>
          <button onClick={copyCode}
            className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0">
            {copied ? <span className="text-emerald-500">Đã chép</span> : <Copy size={14} />}
            <span className="hidden sm:inline">{room.room_code}</span>
          </button>
          {/* Toggle sidebar mobile */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-600 dark:text-slate-400 shrink-0"
          >
            <Users size={18} />
          </button>
        </div>

        {/* Video Grid */}
        <div className="flex-1 bg-slate-900 p-2 md:p-6 flex items-center justify-center relative overflow-hidden">
          <div className={`w-full h-full max-w-6xl mx-auto grid ${getGridClass()} gap-2 md:gap-4 auto-rows-fr`}>

            {/* Local video */}
            <div className={`relative bg-slate-800 rounded-xl md:rounded-2xl overflow-hidden border-2 shadow-lg ${isScreenSharing ? 'border-amber-500' : 'border-primary-500'} ${getVideoAspect()}`}>
              {isVideoOff ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-700 flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-inner">
                    {(user?.full_name || user?.username)?.[0] || 'U'}
                  </div>
                </div>
              ) : (
                <video ref={localVideoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${!isScreenSharing && 'transform -scale-x-100'}`} />
              )}
              <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 flex justify-between items-center">
                <div className="bg-black/60 backdrop-blur-md px-2 md:px-3 py-1 md:py-1.5 rounded-lg flex items-center gap-1.5 md:gap-2">
                  {isMuted && <MicOff size={12} className="text-red-500" />}
                  <span className="text-white text-xs md:text-sm font-semibold truncate max-w-[100px] md:max-w-[150px]">
                    Bạn {isScreenSharing ? "(Chia sẻ)" : (room.host_id === user?.id ? "(Host)" : "")}
                  </span>
                </div>
              </div>
            </div>

            {/* Remote videos */}
            {remoteMembers.map(m => {
              const status = remoteMediaStatus[m.user_id];
              return (
                <div key={m.user_id} className={`relative bg-slate-800 rounded-xl md:rounded-2xl overflow-hidden shadow-lg ${getVideoAspect()}`}>
                  {status?.videoOff ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-700 flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-inner">
                        {(m.full_name || m.username)?.[0]}
                      </div>
                    </div>
                  ) : (
                    <RemoteVideo stream={remoteStreams[m.user_id]} name={m.full_name || m.username} />
                  )}
                  <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-black/60 backdrop-blur-md px-2 md:px-3 py-1 md:py-1.5 rounded-lg flex items-center gap-1.5 md:gap-2">
                    {status?.muted && <MicOff size={12} className="text-red-500" />}
                    {status?.videoOff && <VideoOff size={12} className="text-red-500" />}
                    <span className="text-white text-xs md:text-sm font-semibold truncate max-w-[80px] md:max-w-[120px]">{m.full_name || m.username}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls bar */}
        <div className="h-16 md:h-20 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-2 md:gap-4 px-4 md:px-6 shrink-0">
          <button onClick={toggleMute} className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <button onClick={toggleVideo} disabled={isScreenSharing} className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'} ${isScreenSharing && 'opacity-50 cursor-not-allowed'}`}>
            {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
          </button>

          <button onClick={toggleScreenShare} className={`hidden md:flex w-10 h-10 md:w-12 md:h-12 rounded-full items-center justify-center transition-all ${isScreenSharing ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
            {isScreenSharing ? <StopCircle size={18} /> : <MonitorUp size={18} />}
          </button>

          <div className="w-px h-6 md:h-8 bg-slate-800 mx-1 md:mx-2" />

          <button onClick={leaveRoom} className="px-4 md:px-6 h-10 md:h-12 rounded-full flex items-center justify-center gap-1.5 md:gap-2 bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">
            <PhoneOff size={18} /> <span className="hidden sm:inline">Rời cuộc gọi</span>
          </button>
        </div>
      </div>

      {/* Sidebar thành viên - responsive */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setShowSidebar(false)} />
      )}
      <div className={`
        fixed md:static right-0 top-0 h-full w-64 
        bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 
        flex flex-col z-50 transition-transform duration-300
        ${showSidebar ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0
      `}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"><Users size={16} /> Thành viên ({members.length})</h3>
          <button onClick={() => setShowSidebar(false)} className="md:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {members.map(m => (
            <div key={m.user_id} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                {(m.full_name || m.username)?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{m.full_name || m.username}</p>
                <p className="text-xs text-slate-400">{m.role === 'host' ? '👑 Host' : 'Member'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {hostLeftPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Phòng đã giải tán</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
              Chủ phòng (Host) đã rời đi. Cuộc gọi này đã tự động kết thúc.
            </p>
            <button
              onClick={() => navigate('/stms/student/room')}
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/30"
            >
              Quay lại sảnh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
