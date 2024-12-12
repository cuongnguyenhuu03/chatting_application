import { Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

const SignInPage = lazy(() => import('../pages/Login/SignInPage.jsx'));
const ChattingPage = lazy(() => import('../pages/Chatting/ChattingPage.jsx'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="sign-in" element={<SignInPage />} />
                <Route path="chatting" element={<ChattingPage />} />
                {/* <Route path="sign-up" element={<SignUpPage />} /> */}
                <Route path="*" element={< > Not found page</>} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;