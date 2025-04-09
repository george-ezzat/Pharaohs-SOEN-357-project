// src/pages/SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'consumer'
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { username, email, password, role } = formData;

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
         setMessage('Sign up successful!');
         // For producers, go to add-product; for consumers, go home.
         if (role === 'producer') {
           navigate('/add-product');
         } else {
           navigate('/');
         }
      } else {
         setMessage(data.message || 'Sign up failed.');
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage("An error occurred during sign up.");
    }
  };

  return (
    <div className="container my-4">
      <h2>Sign Up</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
         <div className="mb-3">
           <label htmlFor="username" className="form-label">Username</label>
           <input type="text" className="form-control" id="username" name="username" value={username} onChange={handleChange} required />
         </div>
         <div className="mb-3">
           <label htmlFor="email" className="form-label">Email</label>
           <input type="email" className="form-control" id="email" name="email" value={email} onChange={handleChange} required />
         </div>
         <div className="mb-3">
           <label htmlFor="password" className="form-label">Password</label>
           <input type="password" className="form-control" id="password" name="password" value={password} onChange={handleChange} required />
         </div>
         <div className="mb-3">
           <label htmlFor="role" className="form-label">I am a:</label>
           <select id="role" name="role" className="form-select" value={role} onChange={handleChange}>
              <option value="consumer">Consumer (Shopper)</option>
              <option value="producer">Producer (Seller)</option>
           </select>
         </div>
         <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
      <BottomNav />
    </div>
  );
};

export default SignUp;
