import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react'
import { esES } from  '@clerk/localizations';

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;



if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
  
  
  
  

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}
        localization={esES}
        >
      
    <BrowserRouter>
      < App />
    </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);

reportWebVitals();




