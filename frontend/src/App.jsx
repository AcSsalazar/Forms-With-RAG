import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {Home, CheckResults, LoginRegister, Mentoring } from "./pages/AllPages";
import { AuthProvider } from './contexts/AuthContext';
import Header from "./components/Header";
import NotFound from './components/NotFound';
import Footer from "./components/Footer";
import ScrollToTop from './components/ScrollToTop';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import StartForm from './components/forms/StartForm';
import Diagnosis from './components/forms/Diagnosis';

function App() {
  return (
    <AuthProvider>
      <>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/start-form/' element={<StartForm />} />
          <Route path='/diagnostico/' element={<Diagnosis/>} />
          <Route path='/resultados/' element={<CheckResults />} />
          <Route path='/login/' element={<LoginRegister />} />
          <Route path='/mentorias/' element={<Mentoring />} />
          <Route path='/forgot-password/' element={<ForgotPassword />} />
          <Route path='/reset-password/:token/' element={<ResetPassword />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
        <div id="popup-root"></div> {/* Contenedor para los popups */}
      </>
    </AuthProvider>
  );
}

export default App;