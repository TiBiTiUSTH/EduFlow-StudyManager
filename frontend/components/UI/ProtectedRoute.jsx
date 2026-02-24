import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userRoles = JSON.parse(localStorage.getItem('roles') || '[]');

    if (!token) {
        return <Navigate to="/stms/login" replace />;
    }

    if (allowedRoles && !allowedRoles.some(role => userRoles.includes(role))) {
        // Nếu không có quyền, quay về dashboard chính của role đó hoặc login
        if (userRoles.includes('admin')) return <Navigate to="/stms/admin" replace />;
        if (userRoles.includes('parent')) return <Navigate to="/stms/parent" replace />;
        if (userRoles.includes('student')) return <Navigate to="/stms/student" replace />;
        return <Navigate to="/stms/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
