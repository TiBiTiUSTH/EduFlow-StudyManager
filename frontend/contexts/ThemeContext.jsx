import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const checkIsNightTime = () => {
        const hour = new Date().getHours();
        return hour < 6 || hour >= 18;
    };

    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('eduflow-theme');
        if (saved !== null) return saved === 'dark';
        return checkIsNightTime();
    });

    // Tự động chuyển đổi theo giờ nếu user chưa tự chọn
    useEffect(() => {
        const saved = localStorage.getItem('eduflow-theme');
        if (saved !== null) return;

        setIsDark(checkIsNightTime());
        const interval = setInterval(() => {
            if (!localStorage.getItem('eduflow-theme')) {
                setIsDark(checkIsNightTime());
            }
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(prev => {
            const next = !prev;
            localStorage.setItem('eduflow-theme', next ? 'dark' : 'light');
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
