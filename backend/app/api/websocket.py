"""
WebSocket Manager cho EduFlow
Quản lý kết nối real-time: Chat channels, DM, Study Room, Notifications
"""

from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List, Set
import json
from datetime import datetime


class ConnectionManager:
    """Quản lý tất cả WebSocket connections"""

    def __init__(self):
        # user_id -> danh sách các kết nối WebSocket
        self.active_connections: Dict[int, List[WebSocket]] = {}
        self.room_members: Dict[str, Set[int]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        """Kết nối user mới"""
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        print(f"[WS] User {user_id} connected. Total connections: {self._total_connections()}")

    def disconnect(self, websocket: WebSocket, user_id: int):
        """Ngắt kết nối user"""
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        # Xóa khỏi tất cả các phòng
        for room_id in list(self.room_members.keys()):
            self.room_members[room_id].discard(user_id)
            if not self.room_members[room_id]:
                del self.room_members[room_id]
        print(f"[WS] User {user_id} disconnected. Total connections: {self._total_connections()}")

    def is_online(self, user_id: int) -> bool:
        """Check user có online không"""
        return user_id in self.active_connections and len(self.active_connections[user_id]) > 0

    def get_online_users(self) -> List[int]:
        """Lấy danh sách user đang online"""
        return list(self.active_connections.keys())

    # Quản lý Phòng

    def join_room(self, room_id: str, user_id: int):
        """User join vào room (study room hoặc subject channel)"""
        if room_id not in self.room_members:
            self.room_members[room_id] = set()
        self.room_members[room_id].add(user_id)
        print(f"[WS] User {user_id} joined room {room_id}")

    def leave_room(self, room_id: str, user_id: int):
        """User rời khỏi room"""
        if room_id in self.room_members:
            self.room_members[room_id].discard(user_id)
            if not self.room_members[room_id]:
                del self.room_members[room_id]
        print(f"[WS] User {user_id} left room {room_id}")

    def get_room_members(self, room_id: str) -> Set[int]:
        """Lấy danh sách members trong room"""
        return self.room_members.get(room_id, set())

    # Gửi Tin Nhắn

    async def send_personal(self, user_id: int, data: dict):
        """Gửi tin nhắn đến 1 user cụ thể (tất cả tabs)"""
        if user_id in self.active_connections:
            message = json.dumps(data, default=str)
            disconnected = []
            for ws in self.active_connections[user_id]:
                try:
                    await ws.send_text(message)
                except Exception:
                    disconnected.append(ws)
            for ws in disconnected:
                self.active_connections[user_id].remove(ws)

    async def broadcast_to_room(self, room_id: str, data: dict, exclude_user: int = None):
        """Broadcast tin nhắn đến tất cả members trong room"""
        members = self.get_room_members(room_id)
        for user_id in members:
            if user_id != exclude_user:
                await self.send_personal(user_id, data)

    async def broadcast_to_all(self, data: dict, exclude_user: int = None):
        """Broadcast đến tất cả users đang online"""
        for user_id in list(self.active_connections.keys()):
            if user_id != exclude_user:
                await self.send_personal(user_id, data)

    # Hàm Phụ Trợ

    def _total_connections(self) -> int:
        return sum(len(conns) for conns in self.active_connections.values())


# Khởi tạo một đối tượng duy nhất
manager = ConnectionManager()
