import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {Home} from "./pages/AllPages";
// import { AuthProvider } from './contexts/AuthContext';
import Header from "./components/Header";
import NotFound from './components/NotFound';
import Footer from "./components/Footer";
import ScrollToTop from './components/ScrollToTop';
import StartForm from './components/forms/StartForm';
import Diagnosis from './components/forms/Diagnosis';
import FormCatalog from './components/forms/FormCatalog';
import FormSearcher from './components/forms/FormSearcher';

function App() {
  return (
    //<AuthProvider>
      <>
        <ScrollToTop />
        <Header />
        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/testsearcher/' element={<FormSearcher/>} />
          <Route path='/start-form/' element={<StartForm />} />
          <Route path='/diagnostico/' element={<Diagnosis/>} />
          <Route path='/catalog/' element={<FormCatalog />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
        <div id="popup-root"></div> {/* Contenedor para los popups */}
      </>

   // </AuthProvider>
  );
}

export default App;






