// src/components/BottomNav.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaCamera, FaHome, FaUser } from 'react-icons/fa';

const BottomNav = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();  // Update UI on sign out
  };

  return (
    <nav className="bottom-nav fixed-bottom bg-light border-top">
      <ul className="nav justify-content-around">
        <li className="nav-item">
          <Link className="nav-link" to="/"><FaHome size={24} /></Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/scan"><FaCamera size={24} /></Link>
        </li>
      
        <li className="nav-item">
          <Link className="nav-link" to="/cart"><FaShoppingCart size={24} /></Link>
        </li>
        {user ? (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/profile"><FaUser size={24} /></Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={handleSignOut}>
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/signin">
                <span style={{ fontSize: "20px" }}>Sign In</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">
                <span style={{ fontSize: "20px" }}>Sign Up</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default BottomNav;
