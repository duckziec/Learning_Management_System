import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HeaderStudent from '../../components/ui/HeaderStudent';
import FooterStudent from '../../components/ui/FooterStudent';
import ChatBot from '../../components/ui/ChatBot';
import PageLoader from '../../components/ui/PageLoader';
import { ProblemProvider } from '../../context/ProblemContext';

// Các trang không hiện chatbot
const NO_CHATBOT_ROUTES = ['/', '/home', '/dashboard'];
const NO_CHATBOT_PREFIXES = ['/blog', '/'];

function useShouldShowChatbot() {
    const { pathname } = useLocation();
    if (NO_CHATBOT_ROUTES.includes(pathname)) return false;
    if (pathname.startsWith('/blog')) return false;
    return true;
}

// =============================================
// StudentLayout
// =============================================

function StudentLayout() {
    const showChatbot = useShouldShowChatbot();

    return (
        <ProblemProvider>
            <div className="student-layout">
                <HeaderStudent />
                <main className="student-main">
                    <Suspense fallback={<PageLoader />}>
                        <Outlet />
                    </Suspense>
                </main>
                <FooterStudent role="student" />
                {showChatbot && <ChatBot />}
            </div>
        </ProblemProvider>
    );
}

export default StudentLayout;
