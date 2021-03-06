import React from 'react';

export default function Login(props) {
  const auth = props.auth;
  return (
    <div className='login'>
        <div className='login-header'>
          <p>Pressure Monitor</p>
        </div>
        <button className='button-login' onClick={auth.login.bind(this)}>Login</button>
    </div>
  );
}