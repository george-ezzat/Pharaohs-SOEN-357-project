// src/pages/SignIn.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        // Save user info in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Sign in successful!');
        navigate('/profile');
      } else {
        setMessage(data.message || 'Sign in failed.');
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      setMessage("An error occurred during sign in.");
    }
  };

  return (
    <div className="container my-4">
      <h2>Sign In</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
         <div className="mb-3">
           <label htmlFor="email" className="form-label">Email</label>
           <input type="email" className="form-control" id="email" name="email" onChange={handleChange} required />
         </div>
         <div className="mb-3">
           <label htmlFor="password" className="form-label">Password</label>
           <input type="password" className="form-control" id="password" name="password" onChange={handleChange} required />
         </div>
         <button type="submit" className="btn btn-primary">Sign In</button>
      </form>
      <BottomNav />
    </div>
  );
};

export default SignIn;
