import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import socket from '@/lib/socket';

const VideoCallContext = createContext(null);

export function VideoCallProvider({ children }) {
  const [callState, setCallState] = useState('idle');
  const [remoteUserId, setRemoteUserId] = useState(null);
  const [remoteUsername, setRemoteUsername] = useState('');
  const [roomId, setRoomId] = useState(null);

  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const peerConnection = useRef(null);

  const ICE_SERVERS = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  const startCall = useCallback(async (targetId, targetName, room) => {
    setRemoteUserId(targetId);
    setRemoteUsername(targetName);
    setRoomId(room);
    setCallState('calling');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      localStream.current = stream;

      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnection.current = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.send({ type: 'ice_candidate', target_id: targetId, candidate: e.candidate });
        }
      };

      pc.ontrack = (e) => { remoteStream.current = e.streams[0]; };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.send({ type: 'call_request', target_id: targetId, room_id: room, caller_name: targetName });
      socket.send({ type: 'video_offer', target_id: targetId, offer });
    } catch (err) {
      console.error('Failed to start call:', err);
      endCall();
    }
  }, []);

  const acceptCall = useCallback(async (offer, callerId) => {
    setCallState('connected');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      localStream.current = stream;

      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnection.current = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.send({ type: 'ice_candidate', target_id: callerId, candidate: e.candidate });
        }
      };

      pc.ontrack = (e) => { remoteStream.current = e.streams[0]; };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.send({ type: 'video_answer', target_id: callerId, answer });
      socket.send({ type: 'call_accept', target_id: callerId });
    } catch (err) {
      console.error('Failed to accept call:', err);
      endCall();
    }
  }, []);

  const endCall = useCallback(() => {
    if (remoteUserId) {
      socket.send({ type: 'call_end', target_id: remoteUserId });
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach(t => t.stop());
      localStream.current = null;
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    remoteStream.current = null;
    setCallState('idle');
    setRemoteUserId(null);
    setRemoteUsername('');
  }, [remoteUserId]);

  const toggleMute = useCallback(() => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    }
  }, []);

  const toggleCamera = useCallback(() => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
    }
  }, []);

  return (
    <VideoCallContext.Provider value={{
      callState, remoteUserId, remoteUsername, roomId,
      localStream, remoteStream,
      startCall, acceptCall, endCall,
      toggleMute, toggleCamera,
      setCallState, setRemoteUserId, setRemoteUsername,
    }}>
      {children}
    </VideoCallContext.Provider>
  );
}

export function useVideoCall() {
  const ctx = useContext(VideoCallContext);
  if (!ctx) throw new Error('useVideoCall must be inside VideoCallProvider');
  return ctx;
}
