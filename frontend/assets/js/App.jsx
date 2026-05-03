import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { PomodoroProvider } from '../../contexts/PomodoroContext';
import { ToastProvider } from '../../components/UI/Toast';
import { VideoCallProvider } from '../../contexts/VideoCallContext';
import FloatingVideoCall from '../../components/video/FloatingVideoCall';
import IncomingCallPopup from '../../components/video/IncomingCallPopup';
import MainLayout from '../../components/Layout/MainLayout';

// Pages
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage';
import StudentDashboard from '../../pages/student/StudentDashboard';
import TaskPage from '../../pages/student/TaskPage';
import SchedulePage from '../../pages/student/SchedulePage';
import SubjectsPage from '../../pages/student/SubjectsPage';
import PomodoroPage from '../../pages/student/PomodoroPage';
import AIPage from '../../pages/student/AIPage';

import StudyMaterialPage from '../../pages/student/StudyMaterialPage';
import StudyRoomPage from '../../pages/student/StudyRoomPage';
import CommunityPage from '../../pages/student/CommunityPage';
import MatchingPage from '../../pages/student/MatchingPage';
import StudyRoomDetailPage from '../../pages/student/StudyRoomDetailPage';
import ResourceLibraryPage from '../../pages/student/ResourceLibraryPage';
import VerifyEmailPage from '../../pages/VerifyEmailPage';
import ForgotPasswordPage from '../../pages/ForgotPasswordPage';
import ProfilePage from '../../pages/ProfilePage';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import AdminLoginPage from '../../pages/admin/AdminLoginPage';
import AdminLogsPage from '../../pages/admin/AdminLogsPage';
import AdminSettingsPage from '../../pages/admin/AdminSettingsPage';
import AdminLayout from '../../components/Layout/AdminLayout';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <PomodoroProvider>
                    <ToastProvider>
                        <VideoCallProvider>
                            <Router>
                                <FloatingVideoCall />
                                <IncomingCallPopup />
                                <Routes>
                                    {/* Đăng nhập/Đăng ký */}
                                    <Route path="/stms/login" element={<LoginPage />} />
                                    <Route path="/stms/register" element={<RegisterPage />} />
                                    <Route path="/stms/verify-email" element={<VerifyEmailPage />} />
                                    <Route path="/stms/forgot-password" element={<ForgotPasswordPage />} />

                                    {/* Sinh viên/học sinh */}
                                    <Route path="/stms/student" element={
                                        <MainLayout><StudentDashboard /></MainLayout>
                                    } />
                                    <Route path="/stms/student/tasks" element={
                                        <MainLayout><TaskPage /></MainLayout>
                                    } />
                                    <Route path="/stms/student/schedule" element={
                                        <MainLayout><SchedulePage /></MainLayout>
                                    } />
                                    <Route path="/stms/student/subjects" element={
                                        <MainLayout><SubjectsPage /></MainLayout>
                                    } />
                                    <Route path="/stms/student/pomodoro" element={
                                        <MainLayout><PomodoroPage /></MainLayout>
                                    } />
                                    <Route path="/stms/student/ai" element={
                                        <MainLayout><AIPage /></MainLayout>
                                    } />

                                    <Route path="/stms/student/material/:id" element={
                                        <MainLayout><StudyMaterialPage /></MainLayout>
                                    } />
                                    <Route path="/stms/student/community" element={
                                        <Navigate to="/stms/student/community/group" replace />
                                    } />
                                    <Route path="/stms/student/community/group" element={
                                        <MainLayout><CommunityPage /></MainLayout>
                                    } />
                                    <Route path="/stms/student/community/friends" element={
                                        <MainLayout><CommunityPage /></MainLayout>
                                    } />
                                    <Route path="/stms/student/matching" element={
                                        <MainLayout><MatchingPage /></MainLayout>
                                    } />
                                    <Route path="/stms/student/room" element={
                                        <MainLayout><StudyRoomPage /></MainLayout>
                                    } />
                                    <Route path="/stms/student/room/:roomId" element={
                                        <MainLayout><StudyRoomDetailPage /></MainLayout>
                                    } />
                                    <Route path="/stms/student/resources" element={
                                        <MainLayout><ResourceLibraryPage /></MainLayout>
                                    } />
                                    <Route path="/stms/student/profile" element={
                                        <MainLayout><ProfilePage /></MainLayout>
                                    } />

                                    {/* Mặc định */}
                                    <Route path="/" element={<Navigate to="/stms/login" replace />} />

                                    {/* Admin */}
                                    <Route path="/stms/admin/login" element={<AdminLoginPage />} />
                                    <Route path="/stms/admin" element={
                                        <AdminLayout><AdminDashboard /></AdminLayout>
                                    } />
                                    <Route path="/stms/admin/logs" element={
                                        <AdminLayout><AdminLogsPage /></AdminLayout>
                                    } />
                                    <Route path="/stms/admin/settings" element={
                                        <AdminLayout><AdminSettingsPage /></AdminLayout>
                                    } />
                                    <Route path="/stms/admin/*" element={<Navigate to="/stms/admin" replace />} />

                                    <Route path="*" element={<Navigate to="/stms/login" replace />} />
                                </Routes>
                            </Router>
                        </VideoCallProvider>
                    </ToastProvider>
                </PomodoroProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
