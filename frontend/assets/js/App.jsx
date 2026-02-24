import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage';
import MainLayout from '../../components/Layout/MainLayout';
import ProtectedRoute from '../../components/UI/ProtectedRoute';
import StudentDashboard from '../../pages/student/StudentDashboard';
import PomodoroPage from '../../pages/student/PomodoroPage';
import TaskPage from '../../pages/student/TaskPage';
import SchedulePage from '../../pages/student/SchedulePage';
import SubjectsPage from '../../pages/student/SubjectsPage';
import ParentDashboard from '../../pages/parent/ParentDashboard';
import AdminDashboard from '../../pages/admin/AdminDashboard';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <Routes>
                    <Route path="/" element={<Navigate to="/stms/login" />} />
                    <Route path="/stms/login" element={<LoginPage isAdminLogin={false} />} />
                    <Route path="/stms/admin/login" element={<LoginPage isAdminLogin={true} />} />
                    <Route path="/stms/register" element={<RegisterPage />} />

                    {/* Student Routes */}
                    <Route path="/stms/student/*" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <MainLayout>
                                <Routes>
                                    <Route path="/" element={<StudentDashboard />} />
                                    <Route path="/tasks" element={<TaskPage />} />
                                    <Route path="/schedule" element={<SchedulePage />} />
                                    <Route path="/subjects" element={<SubjectsPage />} />
                                    <Route path="/pomodoro" element={<PomodoroPage />} />
                                    <Route path="/reports" element={<div>Báo cáo tiến độ</div>} />
                                </Routes>
                            </MainLayout>
                        </ProtectedRoute>
                    } />

                    {/* Parent Routes */}
                    <Route path="/stms/parent/*" element={
                        <ProtectedRoute allowedRoles={['parent']}>
                            <MainLayout>
                                <Routes>
                                    <Route path="/" element={<ParentDashboard />} />
                                    <Route path="/reports" element={<div>Báo cáo tổng hợp</div>} />
                                    <Route path="/chat" element={<div>Trò chuyện</div>} />
                                </Routes>
                            </MainLayout>
                        </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/stms/admin/*" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <MainLayout>
                                <Routes>
                                    <Route path="/" element={<AdminDashboard />} />
                                    <Route path="/users" element={<div>Quản lý người dùng</div>} />
                                    <Route path="/settings" element={<div>Cấu hình hệ thống</div>} />
                                </Routes>
                            </MainLayout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
