import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import '../stylesheets/login.css';

function AuthForm() {
  return (
    <div className="lineabase">
      <div className="document-check">
        <div className="notice__title--container">
          <h4 className="notice__title">Inicia sesion o crea una cuenta</h4>
        </div>
        <div className="auth-panels">
          <SignIn routing="path" path="/login" />
          <SignUp routing="path" path="/register" />
        </div>
      </div>
    </div>
  );
}

export default AuthForm;